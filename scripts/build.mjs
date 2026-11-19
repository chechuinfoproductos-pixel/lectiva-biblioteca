import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(), dist=path.join(root,'dist');
const ensure=(p)=>fs.mkdirSync(p,{recursive:true});
const copy=(from,to)=>{ensure(path.dirname(to));fs.copyFileSync(from,to)};
fs.rmSync(dist,{recursive:true,force:true});ensure(dist);
for(const f of ['index.html','app.js','styles.css','_headers'])copy(path.join(root,f),path.join(dist,f));
copy(path.join(root,'assets/logo-lectiva-oficial.png'),path.join(dist,'assets/logo-lectiva-oficial.png'));
const dir=path.join(root,'content/books'), entries=fs.readdirSync(dir).filter(x=>x.endsWith('.json')).sort();
const books=[],errors=[];
function resolveMedia(url,kind){
  if(typeof url!=='string')throw Error(`${kind}: ruta vacía`);
  const clean=url.replaceAll('\\','/');
  const prefixes=kind==='pdf'?['/uploads/pdfs/','/media/pdfs/','media/pdfs/']:['/uploads/covers/','/media/covers/','media/covers/'];
  const prefix=prefixes.find(x=>clean.startsWith(x));
  if(!prefix)throw Error(`${kind}: ruta no permitida: ${clean}`);
  const filename=clean.slice(prefix.length);
  if(!filename||filename.includes('/')||filename==='.'||filename==='..')throw Error(`${kind}: nombre inválido`);
  const ext=path.extname(filename).toLowerCase();
  if(kind==='pdf'&&ext!=='.pdf')throw Error('El libro debe ser PDF');
  if(kind==='cover'&&!['.png','.jpg','.jpeg','.webp'].includes(ext))throw Error('Formato de portada no permitido');
  const file=path.join(root,'media',kind==='pdf'?'pdfs':'covers',filename);
  if(!fs.existsSync(file))throw Error(`Archivo no encontrado: ${file}`);
  const stat=fs.statSync(file);
  if(!stat.isFile()||stat.size===0)throw Error(`Archivo vacío: ${file}`);
  if(kind==='pdf'){
    if(stat.size>40*1024*1024)throw Error('PDF supera el límite de 40 MB');
    const fd=fs.openSync(file,'r');const b=Buffer.alloc(5);fs.readSync(fd,b,0,5,0);fs.closeSync(fd);
    if(b.toString()!=='%PDF-')throw Error('Firma PDF inválida');
  }else if(stat.size>8*1024*1024)throw Error('Portada supera 8 MB');
  const publicPath=`/uploads/${kind==='pdf'?'pdfs':'covers'}/${filename}`;
  copy(file,path.join(dist,publicPath.slice(1)));
  return publicPath;
}
for(const name of entries){
 try{
  const item=JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
  if(item.published!==true)continue;
  if(item.rights_confirmed!==true)throw Error('Libro publicado sin declaración de derechos');
  for(const field of ['title','author','description','category']){
   if(typeof item[field]!=='string'||!item[field].trim())throw Error(`Campo obligatorio: ${field}`);
  }
  const pdf=resolveMedia(item.pdf,'pdf'),cover=resolveMedia(item.cover,'cover');
  books.push({id:path.basename(name,'.json'),title:item.title.trim(),author:item.author.trim(),description:item.description.trim(),category:item.category.trim(),language:item.language||'Español',pages:Number.isSafeInteger(item.pages)&&item.pages>0?item.pages:null,pdf,cover,published:true,rights_confirmed:true,added_at:item.added_at||''});
 }catch(e){errors.push(`${name}: ${e.message}`)}
}
if(errors.length){console.error('ERROR DE PUBLICACIÓN:\n'+errors.join('\n'));process.exit(1)}
ensure(path.join(dist,'data'));
fs.writeFileSync(path.join(dist,'data/catalog.json'),JSON.stringify(books,null,2));
console.log(`Lectiva: ${books.length} libro(s) publicado(s). Los borradores no se copian a dist.`);
