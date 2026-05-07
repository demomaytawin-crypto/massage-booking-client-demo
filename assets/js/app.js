let DATA={settings:{},theme:{},features:{},content:{},services:[],branches:[],staff:[],gallery:[],reviews:[],promotions:[],payment:{},terms:{},maintenance:{}};
let booking={service:null,branch:null,staff:null,date:'',time:'',paymentMethod:'qr',customer:{},slipUrl:'',cardToken:''};
let step=0;
let currentLang=localStorage.getItem('siteLang')||'th';
let T={};
const stepKeys=['booking_step_service','booking_step_branch','booking_step_staff','booking_step_datetime','booking_step_customer','booking_step_payment','booking_step_confirm'];
function t(key,fallback=''){return (T&&T[key])||fallback||key}
function stepNames(){return stepKeys.map(k=>t(k,k))}
function setLanguage(lang){currentLang=lang;localStorage.setItem('siteLang',lang);init()}
const fallbackImg='https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=640&q=65';
function $(id){return document.getElementById(id)}
function api(action,payload={}) {
  if(!API_URL || API_URL.includes('PASTE_')) return Promise.resolve({success:false,message:'ยังไม่ได้ตั้งค่า Google Apps Script Web App URL'});
  return fetch(API_URL,{method:'POST',body:JSON.stringify({action,lang:currentLang,...payload})}).then(r=>r.json()).catch(e=>({success:false,message:e.message}));
}
function showToast(msg){const t=$('toast');t.textContent=msg;t.style.display='block';setTimeout(()=>t.style.display='none',2600)}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function money(n){return '฿'+Number(n||0).toLocaleString('th-TH')}
function img(url){return url||fallbackImg}
function enabled(key){return DATA.features[key] !== false && DATA.features[key] !== 'FALSE'}
async function init(){
  seedLocal();
  const cacheKey='PUBLIC_DATA_CACHE_'+currentLang;
  let renderedFromCache=false;
  try{
    const cached=sessionStorage.getItem(cacheKey);
    if(cached){
      DATA={...DATA,...JSON.parse(cached)};
      T=(DATA.translations||{});
      normalizeData(); applyTheme(); renderAll();
      renderedFromCache=true;
    }
  }catch(e){}
  const res=await api('publicData',{lang:currentLang});
  if(res.success){
    DATA={...DATA,...res.data};
    try{ sessionStorage.setItem(cacheKey, JSON.stringify(res.data)); }catch(e){}
  }
  T=(DATA.translations||{});
  normalizeData();
  applyTheme();
  renderAll();
  if(localStorage.getItem('adminToken')) $('adminbar').style.display='block';
}
function seedLocal(){
  DATA={
    settings:{siteName:'นวดไทยเพื่อสุขภาพ',tagline:'Thai Massage & Spa Booking',phone:'02-000-0000',lineUrl:'https://line.me/R/ti/p/@demo',address:'กรุงเทพมหานคร',logoUrl:'',heroImageUrl:''},
    theme:{primaryColor:'#8B5E3C',secondaryColor:'#D4A373',accentColor:'#C9A227',backgroundColor:'#FFF8F0',textColor:'#2B2520',cardColor:'#FFFFFF'},
    features:{show_gallery_page:true,show_reviews_page:true,show_promotions_page:true,enable_online_booking:true,enable_staff_selection:true,enable_qr_payment:true,enable_card_payment:true,show_line_button:true,show_phone_button:true,show_floating_booking_button:true},
    content:{hero:{title:'พักผ่อนอย่างมีระดับ จองคิวได้ง่ายในไม่กี่ขั้นตอน',subtitle:'เลือกบริการ สาขา พนักงาน วันเวลา และชำระเงินได้ครบในหน้าเดียว'},about:{title:'ดูแลทุกสัมผัสด้วยมาตรฐานมืออาชีพ',text:'บริการนวดและสปาที่ออกแบบเพื่อการพักผ่อนของคุณ'}},
    services:[
      {serviceId:'SVC001',serviceName:'นวดไทย',duration:90,price:900,imageUrl:'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=640&q=65',status:'active'},
      {serviceId:'SVC002',serviceName:'นวดอโรม่า',duration:60,price:1200,imageUrl:'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=640&q=65',status:'active'},
      {serviceId:'SVC003',serviceName:'นวดเท้า',duration:60,price:650,imageUrl:'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=640&q=65',status:'active'}
    ],
    branches:[
      {branchId:'BR001',branchName:'สาขาอโศก',address:'อโศก กรุงเทพฯ',phone:'02-111-1111',openTime:'10:00',closeTime:'22:00',imageUrl:'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=640&q=65',status:'active'},
      {branchId:'BR002',branchName:'สาขาทองหล่อ',address:'ทองหล่อ กรุงเทพฯ',phone:'02-222-2222',openTime:'10:00',closeTime:'22:00',imageUrl:'https://images.unsplash.com/photo-1527765675023-1b03787ff744?auto=format&fit=crop&w=640&q=65',status:'active'}
    ],
    staff:[
      {staffId:'ST001',staffName:'พนักงานแพรว',branchId:'BR001',serviceIds:'SVC001,SVC002',imageUrl:'',status:'active'},
      {staffId:'ST002',staffName:'พนักงานดาว',branchId:'BR002',serviceIds:'SVC001,SVC003',imageUrl:'',status:'active'}
    ],
    gallery:[{imageUrl:'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=640&q=65'},{imageUrl:'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=640&q=65'},{imageUrl:'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=640&q=65'},{imageUrl:'https://images.unsplash.com/photo-1527765675023-1b03787ff744?auto=format&fit=crop&w=640&q=65'}],
    reviews:[{customerName:'คุณเอ',rating:5,reviewText:'จองง่าย บริการดีมาก ประทับใจค่ะ'},{customerName:'คุณบี',rating:5,reviewText:'ร้านสะอาด พนักงานสุภาพ ระบบจองสะดวก'}],
    promotions:[{promotionName:'แพ็กเกจผ่อนคลาย',description:'ลดพิเศษสำหรับการจองออนไลน์',imageUrl:'',status:'active'}],
    payment:{enableQrPayment:true,enableCardPayment:true,qrImageUrl:'',promptPayName:'นวดไทยเพื่อสุขภาพ'},
    terms:{consentText:'ฉันยอมรับเงื่อนไขการจองและนโยบายความเป็นส่วนตัว'}
  };
}
function normalizeData(){
  DATA.features=DATA.features||{}; DATA.settings=DATA.settings||{}; DATA.theme=DATA.theme||{}; DATA.content=DATA.content||{};
  ['services','branches','staff','gallery','reviews','promotions'].forEach(k=>DATA[k]=DATA[k]||[]);
}
function applyTheme(){
  const th=DATA.theme||{};
  const vars={primary:th.primaryColor,secondary:th.secondaryColor,accent:th.accentColor,bg:th.backgroundColor,text:th.textColor,card:th.cardColor};
  Object.entries(vars).forEach(([k,v])=>{if(v)document.documentElement.style.setProperty('--'+k,v)});
}
function renderAll(){
  const s=DATA.settings||{}; const c=DATA.content||{};
  $('siteName').childNodes[0].textContent=s.siteName||'นวดไทยเพื่อสุขภาพ';
  $('siteTagline').textContent=s.tagline||'Thai Massage & Spa';
  $('siteLogo').src=s.logoUrl||'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="24" fill="#8B5E3C"/><text x="50" y="58" text-anchor="middle" font-size="42" fill="white">✦</text></svg>');
  $('heroTitle').textContent=(c.hero&&c.hero.title)||$('heroTitle').textContent;
  $('heroSubtitle').textContent=(c.hero&&c.hero.subtitle)||$('heroSubtitle').textContent;
  if(s.heroImageUrl) $('heroPhoto').style.backgroundImage=`linear-gradient(135deg,rgba(139,94,60,.18),rgba(212,163,115,.28)),url('${s.heroImageUrl}')`;
  $('aboutTitle').textContent=(c.about&&c.about.title)||$('aboutTitle').textContent;
  $('aboutText').textContent=(c.about&&c.about.text)||$('aboutText').textContent;
  $('footerName').textContent=s.siteName||'นวดไทยเพื่อสุขภาพ';
  $('footerText').textContent=s.footerText||'ระบบจองคิวนวดออนไลน์ พร้อมหลังบ้านจัดการร้านครบชุด';
  $('lineButton').href=s.lineUrl||'#'; $('phoneButton').href='tel:'+(s.phone||'');
  renderLanguageSwitcher(); applyTranslations(); renderFeatureVisibility(); renderServices(); renderBranches(); renderGallery(); renderReviews(); renderPromos(); renderContact(); renderBooking(); renderPaymentInfo();
}
function renderLanguageSwitcher(){
  const wrap=$('languageSwitcher'); if(!wrap) return;
  const langs=(DATA.languages&&DATA.languages.length?DATA.languages:[
    {languageCode:'th',nativeName:'ไทย'},{languageCode:'en',nativeName:'EN'},{languageCode:'zh',nativeName:'中文'},{languageCode:'ko',nativeName:'한국어'}
  ]);
  wrap.innerHTML=langs.map(l=>`<button class="${String(l.languageCode).toLowerCase()===currentLang?'active':''}" onclick="setLanguage('${esc(String(l.languageCode).toLowerCase())}')">${esc(l.nativeName||l.languageCode)}</button>`).join('');
  document.documentElement.lang=currentLang;
}
function applyTranslations(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.dataset.i18n;
    if(T[key]) el.textContent=T[key];
  });
}
function renderFeatureVisibility(){
  document.querySelectorAll('[data-feature]').forEach(el=>{el.style.display=enabled(el.dataset.feature)?'':'none'});
}
function renderServices(){
  $('serviceCards').innerHTML=DATA.services.filter(x=>x.status!=='inactive').map(s=>`<div class="card"><div class="service-img" style="background-image:url('${img(s.imageUrl)}')"></div><div class="card-body"><span class="pill">${s.duration||60} นาที</span><h3>${esc(s.serviceName)}</h3><p class="sub">${esc(s.description||'บริการยอดนิยมสำหรับการพักผ่อน')}</p><div class="price">${money(s.price)}</div><br><button class="btn" onclick="selectAndBook('service','${esc(s.serviceId)}')">${t('button_book_service','จองบริการนี้')}</button></div></div>`).join('');
}
function renderBranches(){
  $('branchCards').innerHTML=DATA.branches.filter(x=>x.status!=='inactive').map(b=>`<div class="branch-card"><div class="branch-img" style="background-image:url('${img(b.imageUrl)}')"></div><div class="card-body"><h3>${esc(b.branchName)}</h3><p class="sub">${esc(b.address||'')}</p><p class="meta">เปิด ${b.openTime||'10:00'} - ${b.closeTime||'22:00'} | ${esc(b.phone||'')}</p><button class="btn secondary" onclick="selectAndBook('branch','${esc(b.branchId)}')">${t('button_select_branch','เลือกสาขานี้')}</button></div></div>`).join('');
}
function renderGallery(){
  $('galleryGrid').innerHTML=(DATA.gallery||[]).filter(x=>x.status!=='inactive').slice(0,12).map(g=>`<div class="gallery-tile" style="background-image:url('${img(g.imageUrl)}')" onclick="window.open('${img(g.imageUrl)}','_blank')"></div>`).join('');
}
function renderReviews(){
  $('reviewGrid').innerHTML=(DATA.reviews||[]).filter(x=>x.status!=='inactive').slice(0,6).map(r=>`<div class="card"><div class="card-body"><div class="stars">${'★'.repeat(Number(r.rating||5))}</div><p class="sub">“${esc(r.reviewText||'บริการดีมาก')}”</p><b>${esc(r.customerName||'ลูกค้า')}</b><br><span class="meta">${esc(r.branchName||'')}</span></div></div>`).join('');
}
function renderPromos(){
  const ps=(DATA.promotions||[]).filter(x=>x.status!=='inactive').slice(0,2);
  $('promoCards').innerHTML=ps.map(p=>`<div class="card" style="color:var(--text);margin-bottom:12px"><div class="card-body"><h3>${esc(p.promotionName||'โปรโมชั่น')}</h3><p class="sub">${esc(p.description||'รายละเอียดโปรโมชั่น')}</p></div></div>`).join('');
}
function renderContact(){
  const s=DATA.settings||{};
  $('contactInfo').innerHTML=`<h3>${esc(s.siteName||'นวดไทยเพื่อสุขภาพ')}</h3><p class="sub">${esc(s.address||'กรุงเทพมหานคร')}</p><p>โทร: ${esc(s.phone||'-')}</p><p>LINE: ${esc(s.lineId||'-')}</p><p>เวลาเปิด-ปิด: ${esc(s.openTime||'10:00')} - ${esc(s.closeTime||'22:00')}</p>`;
}
function selectAndBook(type,id){booking[type]=id; location.hash='booking'; step= type==='service'?1: type==='branch'?2:0; renderBooking();}
function renderBooking(){
  $('steps').innerHTML=stepNames().map((s,i)=>`<div class="step ${i===step?'active':''}">${i+1}. ${s}</div>`).join('');
  const content=$('bookingContent');
  const summaryHtml = booking.service||booking.branch||booking.date||booking.time ? renderBookingSummary() : '';
  if(step===0) content.innerHTML=summaryHtml+renderOptions('service',DATA.services,'serviceId','serviceName',x=>`${x.duration||60} นาที • ${money(x.price)}`);
  if(step===1) content.innerHTML=summaryHtml+renderOptions('branch',DATA.branches,'branchId','branchName',x=>`${x.address||''} • ${x.openTime||'10:00'}-${x.closeTime||'22:00'}`);
  if(step===2) content.innerHTML=summaryHtml+renderStaffStep();
  if(step===3) content.innerHTML=summaryHtml+renderDateTimeStep();
  if(step===4) content.innerHTML=summaryHtml+renderCustomerStep();
  if(step===5) content.innerHTML=summaryHtml+renderPaymentStep();
  if(step===6) content.innerHTML=summaryHtml+renderConfirmStep();
}

function renderBookingSummary(){
  const s=DATA.services.find(x=>x.serviceId===booking.service)||{};
  const b=DATA.branches.find(x=>x.branchId===booking.branch)||{};
  const st=DATA.staff.find(x=>x.staffId===booking.staff)||{};
  return `<div class="v5-booking-summary">
    <div class="v5-summary-box"><b>บริการ</b>${esc(s.serviceName||'-')}</div>
    <div class="v5-summary-box"><b>สาขา</b>${esc(b.branchName||'-')}</div>
    <div class="v5-summary-box"><b>พนักงาน</b>${booking.staff==='AUTO'?'ให้ร้านจัดให้':esc(st.staffName||'-')}</div>
    <div class="v5-summary-box"><b>วันเวลา</b>${esc(booking.date||'-')} ${esc(booking.time||'')}</div>
  </div>`;
}

function renderOptions(key,rows,idField,nameField,descFn){
  const options=rows.filter(x=>x.status!=='inactive').map(x=>`<div class="option ${booking[key]===x[idField]?'selected':''}" onclick="booking['${key}']='${esc(x[idField])}';renderBooking()"><h3>${esc(x[nameField])}</h3><p class="sub">${esc(descFn(x))}</p></div>`).join('');
  return `<div class="option-grid">${options}</div>${navButtons()}`;
}
function renderStaffStep(){
  let staff=DATA.staff.filter(s=>s.status!=='inactive');
  if(booking.branch) staff=staff.filter(s=>!s.branchId||s.branchId===booking.branch);
  if(booking.service) staff=staff.filter(s=>!s.serviceIds||String(s.serviceIds).includes(booking.service));
  let cards=`<div class="option ${booking.staff==='AUTO'?'selected':''}" onclick="booking.staff='AUTO';renderBooking()"><h3>ให้ร้านจัดพนักงานให้</h3><p class="sub">เหมาะสำหรับลูกค้าที่ต้องการให้ร้านเลือกคนที่ว่างที่สุด</p></div>`;
  if(enabled('enable_staff_selection')) cards += staff.map(s=>`<div class="option ${booking.staff===s.staffId?'selected':''}" onclick="booking.staff='${esc(s.staffId)}';renderBooking()"><h3>${esc(s.staffName)}</h3><p class="sub">${esc(s.skill||'พนักงานนวดมืออาชีพ')}</p></div>`).join('');
  return `<div class="option-grid">${cards}</div>${navButtons()}`;
}
function renderDateTimeStep(){
  const times=['10:00','11:30','13:00','14:30','16:00','17:30','19:00'];
  return `<div class="form-grid"><div class="field"><label>เลือกวันที่</label><input type="date" value="${booking.date}" onchange="booking.date=this.value"></div></div><br><div class="option-grid">${times.map(t=>`<div class="option ${booking.time===t?'selected':''}" onclick="booking.time='${t}';renderBooking()"><h3>${t}</h3><p class="sub">คิวว่าง</p></div>`).join('')}</div>${navButtons()}`;
}
function renderCustomerStep(){
  const c=booking.customer;
  return `<div class="form-grid">
    <div class="field"><label>${t('label_fullname','ชื่อ-นามสกุล')} *</label><input value="${esc(c.fullName||'')}" oninput="booking.customer.fullName=this.value"></div>
    <div class="field"><label>${t('label_phone','เบอร์โทร')} *</label><input value="${esc(c.phone||'')}" oninput="booking.customer.phone=this.value"></div>
    <div class="field"><label>${t('label_email','อีเมล')}</label><input value="${esc(c.email||'')}" oninput="booking.customer.email=this.value"></div>
    <div class="field"><label>LINE ID</label><input value="${esc(c.lineId||'')}" oninput="booking.customer.lineId=this.value"></div>
    <div class="field" style="grid-column:1/-1"><label>${t('label_note','หมายเหตุ')}</label><textarea oninput="booking.customer.note=this.value">${esc(c.note||'')}</textarea></div>
  </div>${navButtons()}`;
}
function renderPaymentInfo(){return true}
function renderPaymentStep(){
  const qr=DATA.payment&&DATA.payment.qrImageUrl?`<img src="${DATA.payment.qrImageUrl}" style="max-width:260px;border-radius:20px;border:1px solid var(--border)">`:`<div class="contact-box"><b>QR Code / PromptPay</b><p class="sub">แอดมินสามารถอัปโหลด QR ได้จากหลังบ้าน</p></div>`;
  return `<div class="option-grid">
    <div class="option ${booking.paymentMethod==='qr'?'selected':''}" onclick="booking.paymentMethod='qr';renderBooking()"><h3>${t('payment_qr','โอนผ่าน QR Code')}</h3><p class="sub">อัปโหลดสลิปหลังโอน</p></div>
    <div class="option ${booking.paymentMethod==='card'?'selected':''}" onclick="booking.paymentMethod='card';renderBooking()"><h3>${t('payment_card','บัตรเครดิต / เดบิต')}</h3><p class="sub">ชำระผ่าน Omise / Opn</p></div>
    <div class="option ${booking.paymentMethod==='none'?'selected':''}" onclick="booking.paymentMethod='none';renderBooking()"><h3>${t('payment_store','จองก่อน ชำระที่ร้าน')}</h3><p class="sub">เปิด/ปิดได้จากหลังบ้าน</p></div>
  </div><br>
  ${booking.paymentMethod==='qr'?`<div>${qr}<br><br><div class="field"><label>อัปโหลดสลิป</label><input type="file" id="slipFile" accept="image/*"></div></div>`:''}
  ${booking.paymentMethod==='card'?renderCardForm():''}
  ${navButtons()}`;
}
function renderCardForm(){
  return `<div class="contact-box"><h3>ข้อมูลบัตร</h3><p class="sub">ระบบจะสร้าง Token กับ Omise โดยไม่เก็บเลขบัตรไว้ในเว็บไซต์</p>
    <div class="form-grid">
      <div class="field"><label>ชื่อบนบัตร</label><input id="cardName"></div>
      <div class="field"><label>เลขบัตร</label><input id="cardNumber" placeholder="4242424242424242"></div>
      <div class="field"><label>เดือนหมดอายุ</label><input id="cardMonth" placeholder="12"></div>
      <div class="field"><label>ปีหมดอายุ</label><input id="cardYear" placeholder="2030"></div>
      <div class="field"><label>CVV</label><input id="cardCvv" placeholder="123"></div>
    </div></div>`;
}
function renderConfirmStep(){
  const s=DATA.services.find(x=>x.serviceId===booking.service)||{}; const b=DATA.branches.find(x=>x.branchId===booking.branch)||{}; const st=DATA.staff.find(x=>x.staffId===booking.staff)||{};
  return `<div class="contact-box"><h3>ตรวจสอบข้อมูลก่อนยืนยัน</h3>
    <p>บริการ: <b>${esc(s.serviceName||'-')}</b> ${money(s.price)}</p>
    <p>สาขา: <b>${esc(b.branchName||'-')}</b></p>
    <p>พนักงาน: <b>${booking.staff==='AUTO'?'ให้ร้านจัดให้':esc(st.staffName||'-')}</b></p>
    <p>วันที่/เวลา: <b>${esc(booking.date)} ${esc(booking.time)}</b></p>
    <p>ผู้จอง: <b>${esc(booking.customer.fullName||'-')}</b> ${esc(booking.customer.phone||'')}</p>
    <label><input type="checkbox" id="consentBox"> ${esc(DATA.terms.consentText||'ฉันยอมรับเงื่อนไขการจองและนโยบายความเป็นส่วนตัว')}</label><br><br>
    <button class="btn" onclick="submitBooking()">${t('button_confirm_booking','ยืนยันการจอง')}</button>
  </div>${navButtons(false)}`;
}
function navButtons(showNext=true){
  return `<div class="booking-nav"><button class="btn secondary" ${step===0?'disabled':''} onclick="step=Math.max(0,step-1);renderBooking()">${t('button_back','ย้อนกลับ')}</button>${showNext?`<button class="btn" onclick="nextStep()">${t('button_next','ถัดไป')}</button>`:''}</div>`;
}
async function nextStep(){
  if(step===5 && booking.paymentMethod==='qr') await maybeUploadSlip();
  if(step===5 && booking.paymentMethod==='card') await createOmiseToken();
  step=Math.min(stepKeys.length-1,step+1); renderBooking();
}
async function maybeUploadSlip(){
  const f=$('slipFile')&&$('slipFile').files[0]; if(!f) return;
  const c=DATA.settings.cloudinaryCloudName||DATA.payment.cloudinaryCloudName; const p=DATA.settings.cloudinaryUploadPreset||DATA.payment.cloudinaryUploadPreset;
  if(!c||!p){showToast('ยังไม่ได้ตั้งค่า Cloudinary'); return;}
  const fd=new FormData(); fd.append('file',f); fd.append('upload_preset',p);
  const res=await fetch(`https://api.cloudinary.com/v1_1/${c}/image/upload`,{method:'POST',body:fd}).then(r=>r.json()).catch(e=>({error:e.message}));
  if(res.secure_url){booking.slipUrl=res.secure_url;showToast('อัปโหลดสลิปสำเร็จ')} else showToast('อัปโหลดสลิปไม่สำเร็จ');
}
async function createOmiseToken(){
  if(!window.Omise){showToast('โหลด Omise.js ไม่สำเร็จ');return}
  const pub=DATA.payment.omisePublicKey||DATA.settings.omisePublicKey;
  if(!pub){showToast('ยังไม่ได้ตั้งค่า Omise Public Key');return}
  Omise.setPublicKey(pub);
  return new Promise(resolve=>{
    Omise.createToken('card',{name:cardName.value,number:cardNumber.value,expiration_month:cardMonth.value,expiration_year:cardYear.value,security_code:cardCvv.value},(status,res)=>{
      if(status===200){booking.cardToken=res.id;showToast('สร้าง Token บัตรสำเร็จ')}else showToast(res.message||'สร้าง Token ไม่สำเร็จ'); resolve();
    });
  });
}
async function submitBooking(){
  if(!$('consentBox').checked){showToast('กรุณายอมรับเงื่อนไขก่อนจอง');return}
  const payload={...booking};
  const res=await api('createBooking',payload);
  if(res.success){showSuccess(res.booking)} else showToast(res.message||'จองไม่สำเร็จ');
}
function showSuccess(b){
  $('bookingContent').innerHTML=`<div class="contact-box"><h2>จองสำเร็จ</h2><p>เลขที่การจอง: <b>${esc(b.bookingId)}</b></p><p>สถานะ: ${esc(b.bookingStatus)}</p><p>การชำระเงิน: ${esc(b.paymentStatus)}</p><a class="btn" href="#check">ตรวจสอบสถานะ</a></div>`;
  $('steps').innerHTML='<div class="step active">จองสำเร็จ</div>';
}
async function checkStatus(){
  const res=await api('checkBookingStatus',{bookingId:checkBookingId.value,phone:checkPhone.value});
  const box=$('checkResult'); box.style.display='block';
  if(!res.success){box.innerHTML='<p style="color:var(--danger)">'+esc(res.message)+'</p>';return;}
  const b=res.booking;
  box.innerHTML=`<h3>สถานะการจอง</h3><p>เลขที่: <b>${esc(b.bookingId)}</b></p><p>ผู้จอง: ${esc(b.fullName)}</p><p>บริการ: ${esc(b.serviceName)}</p><p>สาขา: ${esc(b.branchName)}</p><p>วันเวลา: ${esc(b.bookingDate)} ${esc(b.startTime)}</p><p>สถานะ: <b>${esc(b.bookingStatus)}</b></p>`;
}
function openAdminEditor(section){
  const drawer=$('editDrawer'); drawer.classList.add('open');
  const item=(DATA.content&&DATA.content[section])||{};
  $('drawerBody').innerHTML=`<div class="field"><label>หัวข้อ</label><input id="editTitle" value="${esc(item.title||'')}"></div><div class="field"><label>ข้อความ</label><textarea id="editText">${esc(item.subtitle||item.text||'')}</textarea></div><br><button class="btn" onclick="saveAdminEdit('${section}')">บันทึก</button><button class="btn secondary" onclick="editDrawer.classList.remove('open')">ปิด</button>`;
}
async function saveAdminEdit(section){
  const token=localStorage.getItem('adminToken')||'';
  const res=await api('adminSave',{token,sheet:'ContentSections',idField:'sectionKey',row:{sectionKey:section,title:editTitle.value,text:editText.value,subtitle:editText.value,status:'active'}});
  if(res.success){showToast('บันทึกแล้ว'); DATA.content[section]={title:editTitle.value,text:editText.value,subtitle:editText.value}; renderAll();} else showToast(res.message||'บันทึกไม่สำเร็จ');
}

function openAdminManager(type){
  const map={services:'Services',branches:'Branches',gallery:'Gallery',reviews:'Reviews',promotions:'Promotions'};
  const sheet=map[type]||'ContentSections';
  $('editDrawer').classList.add('open');
  $('drawerBody').innerHTML=`<p class="sub">เปิดหน้าแอดมินเพื่อจัดการข้อมูลหมวด ${sheet} แบบเต็มรูปแบบ</p><button class="btn" onclick="location.href='admin.html#${sheet}'">ไปหน้าแอดมิน</button><button class="btn secondary" onclick="editDrawer.classList.remove('open')">ปิด</button>`;
}
function showAdminInlineButtons(){
  if(localStorage.getItem('adminToken')){
    document.querySelectorAll('.admin-only').forEach(el=>el.style.display='inline-flex');
  }
}

showAdminInlineButtons();
init();
