const SHEET_CONFIG={
  Bookings:{title:'รายการจอง',id:'bookingId'},Services:{title:'บริการ / ราคา',id:'serviceId'},Branches:{title:'สาขา',id:'branchId'},Staff:{title:'พนักงาน / หมอนวด',id:'staffId'},StaffSchedules:{title:'ตารางงานพนักงาน',id:'scheduleId'},Customers:{title:'ลูกค้า',id:'customerId'},Gallery:{title:'แกลเลอรี่',id:'imageId'},Reviews:{title:'รีวิว',id:'reviewId'},Promotions:{title:'โปรโมชั่น',id:'promotionId'},MediaLibrary:{title:'คลังรูปภาพ',id:'mediaId'},PaymentSettings:{title:'ตั้งค่าการชำระเงิน',id:'key'},NotificationSettings:{title:'ตั้งค่าการแจ้งเตือน',id:'channel'},FeatureSettings:{title:'เปิด/ปิดฟังก์ชัน',id:'featureKey'},ThemeSettings:{title:'ธีมและสี',id:'id'},ContentSections:{title:'Content Editor',id:'sectionKey'},FormSettings:{title:'ตั้งค่าฟอร์มการจอง',id:'fieldKey'},CapacityRules:{title:'Capacity Limit',id:'ruleId'},AdminUsers:{title:'ผู้ใช้แอดมิน',id:'adminId'},Roles:{title:'บทบาท',id:'roleId'},Permissions:{title:'สิทธิ์การใช้งาน',id:'roleId'},MaintenanceSettings:{title:'Maintenance Mode',id:'key'},TermsSettings:{title:'Terms / Privacy Consent',id:'key'},Languages:{title:'ภาษา / Languages',id:'languageCode'},Translations:{title:'คำแปลเว็บไซต์',id:'translationKey'},ServiceTranslations:{title:'คำแปลบริการ',id:'serviceId'},BranchTranslations:{title:'คำแปลสาขา',id:'branchId'},PromotionTranslations:{title:'คำแปลโปรโมชั่น',id:'promotionId'},NotificationTemplateTranslations:{title:'คำแปลแจ้งเตือน',id:'templateKey'},ActivityLogs:{title:'Activity Logs',id:'logId'},BackupLogs:{title:'Backup Logs',id:'backupId'}
};
const MENU=[
 ['Dashboard','Dashboard','dashboard'],['Bookings','รายการจอง','bookings'],['Calendar','ปฏิทินคิว','bookings'],['Services','บริการ','services'],['Branches','สาขา','branches'],['Staff','พนักงาน','staff'],['StaffSchedules','ตารางงาน','staff'],['Customers','ลูกค้า','customers'],['Gallery','แกลเลอรี่','content'],['Reviews','รีวิว','content'],['Promotions','โปรโมชั่น','content'],['MediaLibrary','คลังรูป','content'],['PaymentSettings','การชำระเงิน','settings'],['NotificationSettings','การแจ้งเตือน','settings'],['FeatureSettings','เปิด/ปิดฟังก์ชัน','settings'],['ThemeSettings','ธีมและสี','settings'],['ContentSections','แก้ไขเนื้อหา','content'],['LanguageSettings','ตั้งค่าภาษา','settings'],['Translations','คำแปลเว็บ','settings'],['ServiceTranslations','แปลบริการ','settings'],['BranchTranslations','แปลสาขา','settings'],['PromotionTranslations','แปลโปรโมชั่น','settings'],['NotificationTemplateTranslations','แปลแจ้งเตือน','settings'],['FormSettings','ฟอร์มจอง','settings'],['CapacityRules','จำกัดคิว','settings'],['AdminUsers','แอดมิน','users'],['Roles','บทบาท','users'],['Permissions','สิทธิ์','users'],['SetupWizard','Setup Wizard','settings'],['MaintenanceSettings','ปิดปรับปรุง','settings'],['TermsSettings','เงื่อนไข/นโยบาย','settings'],['Reports','รายงาน/Export','reports'],['ActivityLogs','ประวัติ','reports'],['Help','คู่มือ','help']
];
let token=localStorage.getItem('adminToken')||'', session=null, currentSheet='Dashboard', rows=[], headers=[];
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function api(action,payload={}){if(!API_URL||API_URL.includes('PASTE_'))return Promise.resolve({success:false,message:'ยังไม่ได้ใส่ Google Apps Script Web App URL ใน admin.html'});return fetch(API_URL,{method:'POST',body:JSON.stringify({action,token,...payload})}).then(r=>r.json()).catch(e=>({success:false,message:e.message}))}
function toast(msg,type=''){content.insertAdjacentHTML('afterbegin',`<div class="notice ${type}">${esc(msg)}</div>`);setTimeout(()=>{const n=document.querySelector('.notice');if(n)n.remove()},3600)}
async function login(){const res=await api('adminLogin',{email:loginEmail.value,password:loginPassword.value});if(res.success){token=res.token;session=res.admin;localStorage.setItem('adminToken',token);localStorage.setItem('adminRole',res.admin.roleId||'owner');showApp()}else loginMsg.innerHTML='<p style="color:red">'+esc(res.message)+'</p>'}
function logout(){localStorage.removeItem('adminToken');localStorage.removeItem('adminRole');location.reload()}
function openCustomer(){window.open('index.html','_blank')}
function showApp(){loginWrap.style.display='none';app.style.display='block';renderNav();loadPage('Dashboard')}
function allowed(menu){return true}
function renderNav(){nav.innerHTML=MENU.filter(m=>allowed(m)).map(([key,label])=>`<button data-key="${key}" onclick="loadPage('${key}')">${label}</button>`).join('')}
function setActive(key){document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.key===key));currentSheet=key;pageTitle.textContent=(SHEET_CONFIG[key]&&SHEET_CONFIG[key].title)||MENU.find(m=>m[0]===key)?.[1]||key}
async function loadPage(key){setActive(key);sidebar.classList.remove('open');if(key==='Dashboard')return renderDashboard();if(key==='Calendar')return renderCalendar();if(key==='Reports')return renderReports();if(key==='SetupWizard')return renderSetupWizard();if(key==='Help')return renderHelp();if(key==='PaymentSettings')return renderPaymentSettings();if(key==='NotificationSettings')return renderNotificationSettings();if(key==='ThemeSettings')return renderThemeSettings();if(key==='FeatureSettings')return renderFeatureToggles();if(key==='MediaLibrary')return renderMediaLibrary();if(key==='ContentSections')return renderContentEditor();if(key==='LanguageSettings')return renderLanguageSettings();return renderSheetPage(key)}
async function renderDashboard(){content.innerHTML='<div class="notice">กำลังโหลด Dashboard...</div>';const res=await api('dashboard');if(!res.success){content.innerHTML=`<div class="notice dangerbox">${esc(res.message)}</div>`;return}const s=res.stats;content.innerHTML=`<div class="cards"><div class="card"><div>ยอดจองทั้งหมด</div><div class="kpi">${s.totalBookings||0}</div></div><div class="card"><div>ยอดจองวันนี้</div><div class="kpi">${s.todayBookings||0}</div></div><div class="card"><div>ยืนยันแล้ว</div><div class="kpi">${s.confirmed||0}</div></div><div class="card"><div>รายได้รวม</div><div class="kpi">฿${Number(s.revenue||0).toLocaleString('th-TH')}</div></div></div><br><div class="grid two"><div class="card"><h3>กราฟยอดจอง 7 วัน</h3>${barChart(s.daily||[])}</div><div class="card"><h3>รายการจองล่าสุด</h3>${tableHtml(res.latest||[],['bookingId','fullName','phone','serviceName','branchName','bookingDate','startTime','bookingStatus'])}</div></div><br><div class="card"><h3>ทางลัดการจัดการ</h3><div class="toolbar"><button class="btn" onclick="loadPage('Bookings')">จัดการจอง</button><button class="btn" onclick="loadPage('Calendar')">เปิดปฏิทิน</button><button class="btn" onclick="loadPage('Services')">บริการ</button><button class="btn" onclick="loadPage('PaymentSettings')">ชำระเงิน</button><button class="btn" onclick="loadPage('ThemeSettings')">ธีม</button></div></div>`}
function barChart(data){if(!data.length)data=[{label:'จ',value:3},{label:'อ',value:5},{label:'พ',value:4},{label:'พฤ',value:6},{label:'ศ',value:9},{label:'ส',value:7},{label:'อา',value:4}];const max=Math.max(...data.map(x=>Number(x.value)||0),1);return `<div class="chart">${data.map(x=>`<div class="bar" style="height:${(Number(x.value)||0)/max*180+20}px"><b>${x.value||0}</b><span>${esc(x.label||'')}</span></div>`).join('')}</div>`}
async function renderSheetPage(sheet){content.innerHTML='<div class="notice">กำลังโหลดข้อมูล...</div>';const res=await api('adminList',{sheet});if(!res.success){content.innerHTML=`<div class="notice dangerbox">${esc(res.message)}</div>`;return}rows=res.rows||[];headers=res.headers||[];const cfg=SHEET_CONFIG[sheet]||{id:'id'};content.innerHTML=`<div class="card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><div><h3>${esc(cfg.title||sheet)}</h3><p class="muted">เพิ่ม ลบ แก้ไขข้อมูลได้จากหน้านี้</p></div><div class="toolbar"><input id="searchBox" placeholder="ค้นหา..." oninput="filterTable()"><button class="btn" onclick="openEdit()">เพิ่มข้อมูล</button><button class="btn alt" onclick="exportSheet('${sheet}')">Export CSV</button></div></div><div id="tableWrap">${renderTable(rows)}</div></div>`}
function tableHtml(rs,cols){if(!rs.length)return '<p class="muted">ยังไม่มีข้อมูล</p>';return `<table><thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rs.map(r=>`<tr>${cols.map(c=>`<td>${fmt(r[c],c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`}
function renderTable(rs){if(!rs.length)return '<p class="muted">ยังไม่มีข้อมูล</p>';let cols=headers.length?headers:Object.keys(rs[0]);if(cols.length>10)cols=cols.slice(0,10);return `<table><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}<th>จัดการ</th></tr></thead><tbody>${rs.map(r=>`<tr>${cols.map(c=>`<td>${fmt(r[c],c)}</td>`).join('')}<td>${actionButtons(r)}</td></tr>`).join('')}</tbody></table>`}
function fmt(v,c){if(/status/i.test(c))return `<span class="status">${esc(v||'-')}</span>`;if(String(v||'').startsWith('http')&&/image|url|logo|slip/i.test(c))return `<a href="${esc(v)}" target="_blank">ดูไฟล์</a>`;return esc(v)}
function actionButtons(r){const idField=(SHEET_CONFIG[currentSheet]||{}).id||headers[0];return `<button class="btn alt" onclick='openEdit(${JSON.stringify(r).replace(/'/g,"&#39;")})'>แก้ไข</button> ${currentSheet==='Bookings'?quickBookingActions(r):''} <button class="btn danger" onclick="deleteItem('${esc(r[idField])}')">ลบ</button>`}
function quickBookingActions(r){return `<button class="btn ok" onclick="bookingAction('${esc(r.bookingId)}','confirmed')">ยืนยัน</button><button class="btn alt" onclick="rescheduleBooking('${esc(r.bookingId)}')">เลื่อน</button><button class="btn danger" onclick="bookingAction('${esc(r.bookingId)}','cancelled')">ยกเลิก</button>`}
async function bookingAction(id,status){const note=prompt('หมายเหตุ/เหตุผล (ถ้ามี)','')||'';const res=await api('updateBookingStatus',{bookingId:id,status,note});toast(res.message||'อัปเดตแล้ว',res.success?'success':'dangerbox');loadPage('Bookings')}
function rescheduleBooking(id){modal.classList.add('open');modalTitle.textContent='เลื่อนการจอง';modalBody.innerHTML=`<div class="grid two"><div class="field"><label>วันที่ใหม่</label><input type="date" id="newDate"></div><div class="field"><label>เวลาใหม่</label><input type="time" id="newTime"></div></div><div class="field"><label>เหตุผล</label><textarea id="reason"></textarea></div><button class="btn" onclick="confirmReschedule('${id}')">ยืนยันการเลื่อน</button>`}
async function confirmReschedule(id){const res=await api('rescheduleBooking',{bookingId:id,newDate:newDate.value,newTime:newTime.value,reason:reason.value});closeModal();toast(res.message||'เลื่อนแล้ว',res.success?'success':'dangerbox');loadPage('Bookings')}
function filterTable(){const q=searchBox.value.toLowerCase();const filtered=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q));tableWrap.innerHTML=renderTable(filtered)}
function closeModal(){modal.classList.remove('open')}
function fieldHtml(h,v=''){if(/description|text|note|message|policy|terms|template/i.test(h))return `<div class="field"><label>${esc(h)}</label><textarea id="f_${h}">${esc(v)}</textarea></div>`;if(/date/i.test(h))return `<div class="field"><label>${esc(h)}</label><input type="date" id="f_${h}" value="${esc(v)}"></div>`;if(/time/i.test(h))return `<div class="field"><label>${esc(h)}</label><input type="time" id="f_${h}" value="${esc(v)}"></div>`;if(/enabled|required|auto|is/i.test(h))return `<div class="field"><label>${esc(h)}</label><select id="f_${h}"><option value="TRUE" ${String(v)==='TRUE'||v===true?'selected':''}>TRUE</option><option value="FALSE" ${String(v)==='FALSE'||v===false?'selected':''}>FALSE</option></select></div>`;return `<div class="field"><label>${esc(h)}</label><input id="f_${h}" value="${esc(v)}"></div>`}
function openEdit(row={}){const cfg=SHEET_CONFIG[currentSheet]||{};modal.classList.add('open');modalTitle.textContent='แก้ไข '+(cfg.title||currentSheet);const hs=headers.length?headers:Object.keys(row);modalBody.innerHTML=`<div class="grid two">${hs.map(h=>fieldHtml(h,row[h]||'')).join('')}</div><button class="btn" onclick="saveEdit()">บันทึก</button>`}
async function saveEdit(){const row={};(headers||[]).forEach(h=>{const el=document.getElementById('f_'+h);if(el)row[h]=el.value});const idField=(SHEET_CONFIG[currentSheet]||{}).id||headers[0];const res=await api('adminSave',{sheet:currentSheet,idField,row});closeModal();toast(res.message||'บันทึกแล้ว',res.success?'success':'dangerbox');loadPage(currentSheet)}
async function deleteItem(id){if(!confirm('ยืนยันลบ/ปิดรายการนี้?'))return;const cfg=SHEET_CONFIG[currentSheet]||{};const res=await api('adminDelete',{sheet:currentSheet,idField:cfg.id,id});toast(res.message||'ลบแล้ว',res.success?'success':'dangerbox');loadPage(currentSheet)}
function exportSheet(sheet){api('adminList',{sheet}).then(res=>{if(!res.success)return toast(res.message,'dangerbox');const csv=[res.headers.join(',')].concat((res.rows||[]).map(r=>res.headers.map(h=>`"${String(r[h]??'').replace(/"/g,'""')}"`).join(','))).join('\n');downloadFile(sheet+'.csv',csv)})}
function downloadFile(name,text){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/csv'}));a.download=name;a.click()}
async function renderCalendar(){content.innerHTML='<div class="notice">กำลังโหลดปฏิทิน...</div>';const res=await api('adminList',{sheet:'Bookings'});const bookings=res.rows||[];const days=Array.from({length:35},(_,i)=>{const d=new Date();d.setDate(d.getDate()-d.getDay()+i);return d});content.innerHTML=`<div class="card"><h3>ปฏิทินคิว</h3><div class="toolbar"><button class="btn alt">รายเดือน</button><button class="btn alt">กรองสาขา</button><button class="btn alt">กรองพนักงาน</button></div><div class="calendar">${days.map(d=>{const ymd=d.toISOString().slice(0,10);const ev=bookings.filter(b=>b.bookingDate===ymd).slice(0,3);return `<div class="day"><b>${d.getDate()}</b>${ev.map(e=>`<div class="event">${esc(e.startTime)} ${esc(e.fullName||'')}<br>${esc(e.serviceName||'')}</div>`).join('')}</div>`}).join('')}</div></div>`}
async function renderPaymentSettings(){const res=await api('adminList',{sheet:'PaymentSettings'});const list=res.rows||[];const get=k=>(list.find(x=>x.key===k)||{}).value||'';content.innerHTML=`<div class="grid two"><div class="card"><h3>QR Code / PromptPay</h3>${payField('enableQrPayment','เปิด QR Code',get('enableQrPayment')||'TRUE')}${payField('promptPayName','ชื่อบัญชี',get('promptPayName'))}${payField('qrImageUrl','QR Image URL',get('qrImageUrl'))}<button class="btn" onclick="savePayment()">บันทึก</button></div><div class="card"><h3>Omise / Opn</h3>${payField('enableCardPayment','เปิดจ่ายบัตร',get('enableCardPayment')||'TRUE')}${payField('omisePublicKey','Public Key',get('omisePublicKey'))}<div class="field"><label>Secret Key</label><input id="pay_omiseSecretKey" placeholder="sk_test_... / sk_live_..."></div><div class="toolbar"><button class="btn" onclick="savePayment(true)">บันทึก Secret อย่างปลอดภัย</button><button class="btn alt" onclick="testConnection('omise')">Test Omise</button></div></div><div class="card"><h3>Cloudinary Upload</h3>${payField('cloudinaryCloudName','Cloud Name',get('cloudinaryCloudName'))}${payField('cloudinaryUploadPreset','Upload Preset',get('cloudinaryUploadPreset'))}<button class="btn alt" onclick="testConnection('cloudinary')">Test Cloudinary</button></div></div>`}
function payField(k,label,val){return `<div class="field"><label>${label}</label><input id="pay_${k}" value="${esc(val||'')}"></div>`}
async function savePayment(withSecret=false){const keys=['enableQrPayment','promptPayName','qrImageUrl','enableCardPayment','omisePublicKey','cloudinaryCloudName','cloudinaryUploadPreset'];for(const k of keys){const el=document.getElementById('pay_'+k);if(el)await api('adminSave',{sheet:'PaymentSettings',idField:'key',row:{key:k,value:el.value,type:'text',isSecret:'FALSE'}})}if(withSecret&&pay_omiseSecretKey.value)await api('saveSecret',{key:'OMISE_SECRET_KEY',value:pay_omiseSecretKey.value});toast('บันทึกการชำระเงินแล้ว','success')}
async function renderNotificationSettings(){const res=await api('adminList',{sheet:'NotificationSettings'});rows=res.rows||[];content.innerHTML=`<div class="grid three">${['telegram','line','email'].map(ch=>`<div class="card"><h3>${ch.toUpperCase()}</h3><div class="field"><label>เปิดใช้งาน</label><select id="${ch}_enabled"><option>TRUE</option><option>FALSE</option></select></div><div class="field"><label>Token / Config</label><input id="${ch}_token" placeholder="กรอก token หรือ config"></div><div class="field"><label>Target / Chat ID / Email</label><input id="${ch}_target"></div><button class="btn" onclick="saveNotification('${ch}')">บันทึก</button> <button class="btn alt" onclick="testConnection('${ch}')">Test</button></div>`).join('')}</div><br><div class="card"><h3>Template ข้อความแจ้งเตือน</h3><p class="muted">แก้ได้ในชีท NotificationTemplates หรือเมนูตาราง</p><button class="btn alt" onclick="loadPage('NotificationTemplates')">เปิด Template</button></div>`}
async function saveNotification(ch){await api('adminSave',{sheet:'NotificationSettings',idField:'channel',row:{channel:ch,isEnabled:document.getElementById(ch+'_enabled').value,token:document.getElementById(ch+'_token').value,target:document.getElementById(ch+'_target').value}});toast('บันทึกแล้ว','success')}
async function testConnection(type){const res=await api('testConnection',{type});toast(res.message||'ทดสอบแล้ว',res.success?'success':'dangerbox')}
async function renderThemeSettings(){const res=await api('publicData');const th=(res.data&&res.data.theme)||{};content.innerHTML=`<div class="grid two"><div class="card"><h3>เลือกธีมสำเร็จรูป</h3>${['Thai Spa Premium','#8B5E3C','Herbal Green','#3A5A40','Minimal Cream','#B08968','Luxury Black Gold','#111111','Spa Rose','#A26769','Clean Blue','#426A8C','Aroma Purple','#6D597A'].reduce((a,x,i,arr)=>i%2?a:a+`<button class="btn alt" onclick="applyThemePreset('${x}','${arr[i+1]}')"><span class="theme-swatch" style="background:${arr[i+1]}"></span>${x}</button> `,'')}</div><div class="card"><h3>ปรับสีเองด้วย HEX</h3>${['primaryColor','secondaryColor','accentColor','backgroundColor','textColor','cardColor'].map(k=>`<div class="field"><label>${k}</label><input id="theme_${k}" value="${esc(th[k]||'')}"></div>`).join('')}<button class="btn" onclick="saveTheme()">บันทึกธีม</button><button class="btn alt" onclick="testThemePreview()">Preview</button></div></div>`}
function applyThemePreset(name,color){theme_primaryColor.value=color;theme_secondaryColor.value='#D4A373';theme_accentColor.value='#C9A227';testThemePreview()}
function testThemePreview(){document.documentElement.style.setProperty('--primary',theme_primaryColor.value||'#8B5E3C');document.documentElement.style.setProperty('--secondary',theme_secondaryColor.value||'#D4A373')}
async function saveTheme(){const row={id:'default',themeName:'custom',primaryColor:theme_primaryColor.value,secondaryColor:theme_secondaryColor.value,accentColor:theme_accentColor.value,backgroundColor:theme_backgroundColor.value,textColor:theme_textColor.value,cardColor:theme_cardColor.value};const res=await api('adminSave',{sheet:'ThemeSettings',idField:'id',row});toast(res.message||'บันทึกธีมแล้ว',res.success?'success':'dangerbox')}
async function renderFeatureToggles(){const res=await api('adminList',{sheet:'FeatureSettings'});rows=res.rows||[];content.innerHTML=`<div class="card"><h3>เปิด / ปิดฟังก์ชัน</h3><p class="muted">การปิดคือซ่อนจากหน้าเว็บ ไม่ใช่ลบข้อมูล</p><div class="grid three">${rows.map(r=>`<div class="card"><b>${esc(r.featureName||r.featureKey)}</b><p class="mini">${esc(r.description||'')}</p><select onchange="toggleFeature('${esc(r.featureKey)}',this.value)"><option value="TRUE" ${String(r.isEnabled)==='TRUE'?'selected':''}>เปิด</option><option value="FALSE" ${String(r.isEnabled)==='FALSE'?'selected':''}>ปิด</option></select></div>`).join('')}</div></div>`}
async function toggleFeature(k,v){await api('adminSave',{sheet:'FeatureSettings',idField:'featureKey',row:{featureKey:k,isEnabled:v}});toast('อัปเดตแล้ว','success')}
async function renderMediaLibrary(){content.innerHTML=`<div class="grid two"><div class="card"><h3>อัปโหลดรูปภาพ</h3><div class="upload-preview" id="uploadPreview">Preview</div><br><input type="file" id="uploadFile" accept="image/*" onchange="previewFile()"><div class="field"><label>หมวดหมู่</label><select id="uploadCategory"><option>Logo</option><option>Banner</option><option>Gallery</option><option>Reviews</option><option>Promotions</option><option>Services</option><option>Branches</option><option>Staff</option></select></div><button class="btn" onclick="uploadToCloudinary()">Upload to Cloudinary</button></div><div class="card"><h3>คลังรูป</h3><div id="mediaList">กำลังโหลด...</div></div></div>`;const res=await api('adminList',{sheet:'MediaLibrary'});mediaList.innerHTML=renderTable(res.rows||[])}
function previewFile(){const f=uploadFile.files[0];if(f)uploadPreview.style.backgroundImage=`url('${URL.createObjectURL(f)}')`}
async function uploadToCloudinary(){const cfg=await api('publicData');const p=cfg.data.payment||{};const c=p.cloudinaryCloudName||cfg.data.settings.cloudinaryCloudName;const preset=p.cloudinaryUploadPreset||cfg.data.settings.cloudinaryUploadPreset;if(!c||!preset)return toast('ยังไม่ได้ตั้งค่า Cloudinary','dangerbox');const f=uploadFile.files[0];if(!f)return toast('กรุณาเลือกไฟล์','dangerbox');const fd=new FormData();fd.append('file',f);fd.append('upload_preset',preset);const up=await fetch(`https://api.cloudinary.com/v1_1/${c}/image/upload`,{method:'POST',body:fd}).then(r=>r.json()).catch(e=>({error:e.message}));if(up.secure_url){await api('adminSave',{sheet:'MediaLibrary',idField:'mediaId',row:{mediaId:'MEDIA-'+Date.now(),category:uploadCategory.value,fileName:f.name,url:up.secure_url,createdAt:new Date().toISOString()}});toast('อัปโหลดสำเร็จ','success');renderMediaLibrary()}else toast(up.error?.message||up.error||'อัปโหลดไม่สำเร็จ','dangerbox')}
async function renderContentEditor(){const res=await api('adminList',{sheet:'ContentSections'});rows=res.rows||[];content.innerHTML=`<div class="card"><h3>Content Editor</h3><p class="muted">แก้ข้อความ รูปภาพ หัวข้อ ปุ่ม และเนื้อหาที่แสดงบนหน้าเว็บ</p><div class="toolbar"><button class="btn" onclick="openCustomer()">เปิดหน้าเว็บเพื่อดู Admin Edit Mode</button><button class="btn alt" onclick="openEdit()">เพิ่ม Section</button></div>${renderTable(rows)}</div>`}
function renderSetupWizard(){content.innerHTML=`<div class="card"><h3>Setup Wizard</h3><p class="muted">ตั้งค่าระบบครั้งแรกแบบ Step-by-step</p><div class="grid two">${['ข้อมูลร้าน','โลโก้และ Banner','เลือกธีม','เพิ่มสาขา','เพิ่มบริการ','เพิ่มพนักงาน','ตั้งตารางงาน','ตั้งค่าชำระเงิน','ตั้งค่าแจ้งเตือน','เปิดใช้งานเว็บไซต์'].map((x,i)=>`<div class="card"><h3>${i+1}. ${x}</h3><p class="muted">กดเพื่อไปยังเมนูที่เกี่ยวข้อง</p></div>`).join('')}</div></div>`}
async function renderReports(){const res=await api('dashboard');const s=(res.data||res.stats||{});content.innerHTML=`<div class="grid two"><div class="card"><h3>รายงานภาพรวม</h3>${barChart(s.daily||[])}</div><div class="card"><h3>Export / Backup</h3><div class="toolbar"><button class="btn" onclick="exportBackup()">Export Backup</button><button class="btn alt" onclick="loadPage('ActivityLogs')">Activity Logs</button></div></div></div>`}
async function exportBackup(){const res=await api('exportBackup');if(res.success)downloadFile('backup.json',JSON.stringify(res.data,null,2));else toast(res.message,'dangerbox')}
function renderHelp(){content.innerHTML=`<div class="card"><h3>คู่มือการใช้งาน</h3><div class="grid two">${['วิธีตั้งค่าร้านครั้งแรก','วิธีเพิ่มบริการและราคา','วิธีเพิ่มสาขา','วิธีเพิ่มพนักงาน','วิธีตั้งตารางงาน','วิธีตรวจสลิปและยืนยันจอง','วิธีเลื่อนการจอง','วิธีเปลี่ยนธีมและสี','วิธีเปิด/ปิดฟังก์ชัน','วิธีตั้งค่า Omise / Cloudinary / LINE / Telegram','วิธี Backup / Restore','วิธี Export รายงาน'].map(t=>`<div class="card"><b>${t}</b><p class="muted">ดูขั้นตอนใน README_SETUP_TH.txt ที่แนบมากับไฟล์ ZIP</p></div>`).join('')}</div></div>`}

async function renderLanguageSettings(){
  const langRes=await api('adminList',{sheet:'Languages'});
  const transRes=await api('adminList',{sheet:'Translations'});
  const langs=langRes.rows||[];
  const translations=transRes.rows||[];
  content.innerHTML=`<div class="card">
    <h3>ตั้งค่าภาษา / Multi-language</h3>
    <p class="muted">ระบบ V6 รองรับเริ่มต้น 4 ภาษา: ไทย, English, 中文, 한국어 และสามารถเพิ่มภาษาใหม่ได้จากชีท Languages</p>
    <div class="grid two">
      <div class="card">
        <h3>เปิด / ปิดภาษา</h3>
        ${langs.map(l=>`<div class="field"><label>${esc(l.nativeName||l.languageName||l.languageCode)} (${esc(l.languageCode)})</label>
          <select onchange="saveLanguageSetting('${esc(l.languageCode)}','isEnabled',this.value)">
            <option value="TRUE" ${String(l.isEnabled)==='TRUE'?'selected':''}>เปิด</option>
            <option value="FALSE" ${String(l.isEnabled)==='FALSE'?'selected':''}>ปิด</option>
          </select></div>`).join('')}
        <button class="btn alt" onclick="loadPage('Languages')">จัดการตาราง Languages</button>
      </div>
      <div class="card">
        <h3>ตั้งค่าภาษาเริ่มต้น</h3>
        <p class="muted">เลือกได้ 1 ภาษาเท่านั้น ระบบจะตั้งภาษาอื่นเป็นไม่ใช่ค่าเริ่มต้นอัตโนมัติ</p>
        <select id="defaultLangSelect">${langs.map(l=>`<option value="${esc(l.languageCode)}" ${String(l.isDefault)==='TRUE'?'selected':''}>${esc(l.nativeName||l.languageCode)}</option>`).join('')}</select>
        <br><br><button class="btn" onclick="setDefaultLanguage()">บันทึกภาษาเริ่มต้น</button>
        <button class="btn alt" onclick="loadPage('Translations')">แก้คำแปลหน้าเว็บ</button>
      </div>
    </div>
  </div><br>
  <div class="card">
    <h3>คำแปลหน้าเว็บ</h3>
    <p class="muted">แก้ข้อความเมนู ปุ่ม หน้าเว็บ และขั้นตอนการจองในตารางนี้ได้โดยตรง</p>
    ${tableHtml(translations.slice(0,50),['translationKey','category','th','en','zh','ko'])}
    <br><div class="toolbar">
      <button class="btn" onclick="loadPage('Translations')">เปิดตารางคำแปลทั้งหมด</button>
      <button class="btn alt" onclick="loadPage('ServiceTranslations')">แปลชื่อบริการ</button>
      <button class="btn alt" onclick="loadPage('BranchTranslations')">แปลชื่อสาขา</button>
      <button class="btn alt" onclick="loadPage('PromotionTranslations')">แปลโปรโมชั่น</button>
      <button class="btn alt" onclick="loadPage('NotificationTemplateTranslations')">แปลข้อความแจ้งเตือน</button>
    </div>
  </div>`;
}
async function saveLanguageSetting(code,field,value){
  const res=await api('adminList',{sheet:'Languages'});
  const row=(res.rows||[]).find(x=>String(x.languageCode)===String(code))||{languageCode:code};
  row[field]=value;
  await api('adminSave',{sheet:'Languages',idField:'languageCode',row});
  toast('บันทึกภาษาแล้ว','success');
}
async function setDefaultLanguage(){
  const res=await api('adminList',{sheet:'Languages'});
  const selected=defaultLangSelect.value;
  for(const row of (res.rows||[])){
    row.isDefault = String(row.languageCode)===String(selected) ? 'TRUE' : 'FALSE';
    await api('adminSave',{sheet:'Languages',idField:'languageCode',row});
  }
  await api('adminSave',{sheet:'Settings',idField:'key',row:{key:'defaultLanguage',value:selected,type:'text',description:'ภาษาเริ่มต้นของเว็บไซต์'}});
  toast('บันทึกภาษาเริ่มต้นแล้ว','success');
  renderLanguageSettings();
}

if(token) showApp();

/* =========================
   V4 FINAL MATCH OVERRIDES
   Specialized screen renderers to match the 56-page PDF presentation closer.
   ========================= */

const V4_SPECIAL_PAGES = ['Bookings','Services','Branches','Staff','StaffSchedules','Gallery','Reviews','Promotions','FeatureSettings','FormSettings','CapacityRules','AdminUsers','Roles','Permissions','ActivityLogs'];

const OLD_loadPage = loadPage;
loadPage = async function(key){
  setActive(key);
  sidebar.classList.remove('open');
  if(key==='Bookings') return renderV4Bookings();
  if(key==='Services') return renderV4ListManager('Services','บริการ / ราคา','serviceId','serviceName','imageUrl','description',['duration','price','status']);
  if(key==='Branches') return renderV4ListManager('Branches','สาขา','branchId','branchName','imageUrl','address',['phone','openTime','closeTime','status']);
  if(key==='Staff') return renderV4ListManager('Staff','พนักงาน / หมอนวด','staffId','staffName','imageUrl','skill',['branchId','serviceIds','status']);
  if(key==='StaffSchedules') return renderV4Schedule();
  if(key==='Gallery') return renderV4MediaContent('Gallery','จัดการแกลเลอรี่','imageId','title','imageUrl');
  if(key==='Reviews') return renderV4Reviews();
  if(key==='Promotions') return renderV4ListManager('Promotions','จัดการโปรโมชั่น','promotionId','promotionName','imageUrl','description',['discountType','discountValue','startDate','endDate','status']);
  if(key==='FeatureSettings') return renderV4FeatureToggle();
  if(key==='FormSettings') return renderV4FormSettings();
  if(key==='CapacityRules') return renderV4Capacity();
  if(key==='AdminUsers') return renderV4AdminUsers();
  if(key==='Roles' || key==='Permissions') return renderV4Permissions();
  if(key==='ActivityLogs') return renderV4Logs();
  if(key==='LanguageSettings') return renderLanguageSettings();
  return OLD_loadPage(key);
}

function v4Hero(title, desc, actions=''){
  return `<div class="page-hero"><h2>${esc(title)}</h2><p>${esc(desc)}</p>${actions?`<div class="toolbar">${actions}</div>`:''}</div>`;
}

async function renderV4Bookings(){
  content.innerHTML='<div class="notice">กำลังโหลดรายการจอง...</div>';
  const res=await api('adminList',{sheet:'Bookings'});
  if(!res.success){content.innerHTML=`<div class="notice dangerbox">${esc(res.message)}</div>`;return}
  rows=res.rows||[]; headers=res.headers||[];
  const groups=[
    ['pending_payment','รอชำระเงิน'],['waiting_verification','รอตรวจสลิป'],['confirmed','ยืนยันแล้ว'],['rescheduled','เลื่อนแล้ว']
  ];
  content.innerHTML = v4Hero('รายการจองและการจัดการคิว','ดูรายการจองทั้งหมด ยืนยัน ยกเลิก เลื่อนการจอง และตรวจสอบสลิปได้ในหน้าเดียว',
    `<button class="btn" onclick="openEdit()">เพิ่มการจอง</button><button class="btn alt" onclick="loadPage('Calendar')">ดูปฏิทินคิว</button>`) +
    `<div class="cards"><div class="card"><div>ทั้งหมด</div><div class="kpi">${rows.length}</div></div><div class="card"><div>รอตรวจ</div><div class="kpi">${rows.filter(x=>x.bookingStatus==='waiting_verification').length}</div></div><div class="card"><div>ยืนยันแล้ว</div><div class="kpi">${rows.filter(x=>x.bookingStatus==='confirmed').length}</div></div><div class="card"><div>เลื่อนแล้ว</div><div class="kpi">${rows.filter(x=>x.bookingStatus==='rescheduled').length}</div></div></div><br>
    <div class="card"><div class="toolbar"><input id="searchBox" placeholder="ค้นหาเลขจอง ชื่อ เบอร์..." oninput="filterBookingCards()"><select id="bookingStatusFilter" onchange="filterBookingCards()"><option value="">ทุกสถานะ</option>${groups.map(g=>`<option value="${g[0]}">${g[1]}</option>`).join('')}<option value="cancelled">ยกเลิก</option></select><button class="btn alt" onclick="exportSheet('Bookings')">Export</button></div><div id="bookingCards">${v4BookingCards(rows)}</div></div><br>
    <div class="kanban">${groups.map(([status,label])=>`<div class="lane"><h3>${label}</h3>${rows.filter(x=>x.bookingStatus===status).slice(0,8).map(v4BookingMini).join('')||'<p class="muted">ไม่มีรายการ</p>'}</div>`).join('')}</div>`;
}
function v4BookingCards(rs){
  return rs.map(r=>`<div class="list-card"><div class="thumb" style="background-image:url('${esc(r.slipUrl||'')}')"></div><div><b>${esc(r.bookingId)}</b> <span class="status">${esc(r.bookingStatus||'-')}</span><p class="muted">${esc(r.fullName)} • ${esc(r.phone)}<br>${esc(r.serviceName)} / ${esc(r.branchName)} / ${esc(r.staffName)}<br>${esc(r.bookingDate)} ${esc(r.startTime)}-${esc(r.endTime)} • ${fmt(r.totalAmount,'amount')}</p></div><div class="toolbar">${quickBookingActions(r)}<button class="btn alt" onclick='openEdit(${JSON.stringify(r).replace(/'/g,"&#39;")})'>รายละเอียด</button></div></div>`).join('') || '<p class="muted">ยังไม่มีรายการจอง</p>';
}
function v4BookingMini(r){
  return `<div class="booking-mini"><b>${esc(r.startTime)} ${esc(r.fullName)}</b><br><span class="mini">${esc(r.serviceName)} / ${esc(r.staffName)}</span><br><button class="btn alt" onclick="loadPage('Bookings')">ดู</button></div>`;
}
function filterBookingCards(){
  const q=(searchBox.value||'').toLowerCase(), st=bookingStatusFilter.value;
  const filtered=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q) && (!st || r.bookingStatus===st));
  bookingCards.innerHTML=v4BookingCards(filtered);
}

async function renderV4ListManager(sheet,title,idField,nameField,imgField,descField,metaFields){
  content.innerHTML='<div class="notice">กำลังโหลดข้อมูล...</div>';
  const res=await api('adminList',{sheet});
  if(!res.success){content.innerHTML=`<div class="notice dangerbox">${esc(res.message)}</div>`;return}
  rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML = v4Hero(title, 'จัดการข้อมูลแบบการ์ด เห็นรูป รายละเอียด สถานะ และปุ่มแก้ไขได้ชัดเจน',
    `<button class="btn" onclick="openEdit()">เพิ่มข้อมูล</button><button class="btn alt" onclick="exportSheet('${sheet}')">Export CSV</button>`) +
    `<div class="card"><div class="toolbar"><input id="searchBox" placeholder="ค้นหา..." oninput="filterV4List('${sheet}','${idField}','${nameField}','${imgField}','${descField}','${metaFields.join(',')}')"><button class="btn alt" onclick="renderSheetPage('${sheet}')">ดูแบบตาราง</button></div><div id="v4List">${v4ListCards(rows,sheet,idField,nameField,imgField,descField,metaFields)}</div></div>`;
}
function v4ListCards(rs,sheet,idField,nameField,imgField,descField,metaFields){
  return rs.map(r=>`<div class="list-card"><div class="thumb" style="background-image:url('${esc(r[imgField]||'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80')}')"></div><div><b>${esc(r[nameField]||r[idField])}</b> <span class="status">${esc(r.status||'active')}</span><p class="muted">${esc(r[descField]||'')}</p><p class="mini">${metaFields.map(m=>`${m}: ${esc(r[m]||'-')}`).join(' • ')}</p></div><div class="toolbar"><button class="btn alt" onclick='openEdit(${JSON.stringify(r).replace(/'/g,"&#39;")})'>แก้ไข</button><button class="btn danger" onclick="deleteItem('${esc(r[idField])}')">ลบ</button></div></div>`).join('')||'<p class="muted">ยังไม่มีข้อมูล</p>';
}
function filterV4List(sheet,idField,nameField,imgField,descField,metaCsv){
  const q=searchBox.value.toLowerCase();
  const meta=metaCsv.split(',').filter(Boolean);
  v4List.innerHTML=v4ListCards(rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q)),sheet,idField,nameField,imgField,descField,meta);
}

async function renderV4Schedule(){
  const res=await api('adminList',{sheet:'StaffSchedules'}); rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML = v4Hero('ตารางงานพนักงาน','กำหนดวันทำงาน เวลาเข้างาน เวลาพัก วันหยุด และตารางซ้ำรายสัปดาห์',
    `<button class="btn" onclick="openEdit()">เพิ่มตารางงาน</button>`) +
    `<div class="grid two"><div class="card"><h3>ตารางแบบรายการ</h3>${renderTable(rows)}</div><div class="card"><h3>มุมมองสัปดาห์</h3><div class="calendar">${['จ','อ','พ','พฤ','ศ','ส','อา'].map(d=>`<div class="day"><b>${d}</b>${rows.slice(0,3).map(r=>`<div class="event">${esc(r.staffId)} ${esc(r.startTime)}-${esc(r.endTime)}</div>`).join('')}</div>`).join('')}</div></div></div>`;
}

async function renderV4MediaContent(sheet,title,idField,nameField,imgField){
  const res=await api('adminList',{sheet}); rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML = v4Hero(title,'เพิ่ม ลบ แก้ไขรูปภาพ จัดหมวดหมู่ จัดเรียง และเปิด/ปิดการแสดงผล',
    `<button class="btn" onclick="openEdit()">เพิ่มรายการ</button><button class="btn alt" onclick="loadPage('MediaLibrary')">เปิดคลังรูปภาพ</button>`) +
    `<div class="media-grid">${rows.map(r=>`<div class="media-card"><div class="img" style="background-image:url('${esc(r[imgField]||'')}')"></div><div class="body"><b>${esc(r[nameField]||r[idField])}</b><p class="mini">${esc(r.category||r.status||'')}</p><button class="btn alt" onclick='openEdit(${JSON.stringify(r).replace(/'/g,"&#39;")})'>แก้ไข</button></div></div>`).join('')||'<p class="muted">ยังไม่มีข้อมูล</p>'}</div>`;
}
async function renderV4Reviews(){
  const res=await api('adminList',{sheet:'Reviews'}); rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML = v4Hero('จัดการรีวิว','เพิ่มรีวิว แก้คะแนนดาว ปักหมุดรีวิวเด่น และเปิด/ปิดรีวิวที่แสดงบนเว็บ',
    `<button class="btn" onclick="openEdit()">เพิ่มรีวิว</button>`) +
    `<div class="grid three">${rows.map(r=>`<div class="card"><div style="font-size:20px;color:#F5A623">${'★'.repeat(Number(r.rating||5))}</div><p>“${esc(r.reviewText||'')}”</p><b>${esc(r.customerName||'ลูกค้า')}</b><p class="mini">${esc(r.branchName||'')} ${esc(r.serviceName||'')}</p><div class="toolbar"><button class="btn alt" onclick='openEdit(${JSON.stringify(r).replace(/'/g,"&#39;")})'>แก้ไข</button><button class="btn danger" onclick="deleteItem('${esc(r.reviewId)}')">ลบ</button></div></div>`).join('')}</div>`;
}

async function renderV4FeatureToggle(){
  const res=await api('adminList',{sheet:'FeatureSettings'}); rows=res.rows||[]; headers=res.headers||[];
  const cats=[...new Set(rows.map(r=>r.category||'General'))];
  content.innerHTML = v4Hero('Feature Toggle / เปิด-ปิดฟังก์ชัน','แอดมินสามารถซ่อนหรือแสดงฟังก์ชันได้เอง โดยข้อมูลเดิมไม่ถูกลบ') +
    `<div class="grid two">${cats.map(cat=>`<div class="card"><h3>${esc(cat)}</h3>${rows.filter(r=>(r.category||'General')===cat).map(r=>`<div class="toggle-row"><div><b>${esc(r.featureName||r.featureKey)}</b><p class="mini">${esc(r.description||r.featureKey)}</p></div><div class="switch ${String(r.isEnabled)==='TRUE'?'on':''}" onclick="toggleFeature('${esc(r.featureKey)}',this.classList.contains('on')?'FALSE':'TRUE')"></div></div>`).join('')}</div>`).join('')}</div>`;
}
async function renderV4FormSettings(){
  const res=await api('adminList',{sheet:'FormSettings'}); rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML = v4Hero('ตั้งค่าฟอร์มการจอง','กำหนดช่องที่แสดงและช่องที่บังคับกรอก เช่น ชื่อ เบอร์ อีเมล LINE ID หมายเหตุ สลิป และ Consent') +
    `<div class="card">${rows.map(r=>`<div class="toggle-row"><div><b>${esc(r.fieldName||r.fieldKey)}</b><p class="mini">${esc(r.description||'')}</p></div><div><select onchange="saveFormField('${esc(r.fieldKey)}','isVisible',this.value)"><option value="TRUE" ${r.isVisible==='TRUE'?'selected':''}>แสดง</option><option value="FALSE" ${r.isVisible==='FALSE'?'selected':''}>ซ่อน</option></select> <select onchange="saveFormField('${esc(r.fieldKey)}','isRequired',this.value)"><option value="TRUE" ${r.isRequired==='TRUE'?'selected':''}>บังคับ</option><option value="FALSE" ${r.isRequired==='FALSE'?'selected':''}>ไม่บังคับ</option></select></div></div>`).join('')}</div>`;
}
async function saveFormField(key,field,value){const r=rows.find(x=>x.fieldKey===key)||{fieldKey:key};r[field]=value;await api('adminSave',{sheet:'FormSettings',idField:'fieldKey',row:r});toast('บันทึกแล้ว','success')}
async function renderV4Capacity(){
  const res=await api('adminList',{sheet:'CapacityRules'}); rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML = v4Hero('Capacity Limit / จำกัดจำนวนคิว','กำหนดจำนวนคิวสูงสุดต่อช่วงเวลา ตามสาขา บริการ พนักงาน หรือห้อง',
    `<button class="btn" onclick="openEdit()">เพิ่มกฎจำกัดคิว</button>`) + `<div class="card">${renderTable(rows)}</div>`;
}
async function renderV4AdminUsers(){
  const res=await api('adminList',{sheet:'AdminUsers'}); rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML = v4Hero('จัดการผู้ใช้แอดมิน','เพิ่มแอดมิน กำหนดบทบาท จำกัดสาขาที่ดูแล และเปิด/ปิดบัญชี',
    `<button class="btn" onclick="openEdit()">เพิ่มแอดมิน</button>`) + `<div class="grid three">${rows.map(r=>`<div class="card"><h3>${esc(r.name)}</h3><p>${esc(r.email)}</p><span class="status">${esc(r.roleId)}</span><p class="mini">Branch: ${esc(r.branchId||'ทั้งหมด')} / ${esc(r.status||'active')}</p><button class="btn alt" onclick='openEdit(${JSON.stringify(r).replace(/'/g,"&#39;")})'>แก้ไข</button></div>`).join('')}</div>`;
}
async function renderV4Permissions(){
  const res=await api('adminList',{sheet:'Permissions'}); rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML = v4Hero('กำหนดสิทธิ์การใช้งาน','กำหนดว่าแต่ละ Role เห็นเมนูไหน เพิ่ม แก้ไข ลบ หรือ Export ได้หรือไม่') + `<div class="card">${renderTable(rows)}</div>`;
}
async function renderV4Logs(){
  const res=await api('adminList',{sheet:'ActivityLogs'}); rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML = v4Hero('Activity Logs','บันทึกว่าใครทำอะไร แก้ไขข้อมูลไหน เวลาใด เพื่อความปลอดภัยและตรวจสอบย้อนหลัง') + `<div class="card">${renderTable(rows.slice().reverse())}</div>`;
}


/* =========================
   V5 PIXEL + PRODUCTION MATCH
   More specialized renderers + setup QA screens.
   ========================= */

const OLD_V4_loadPage = loadPage;
loadPage = async function(key){
  setActive(key);
  sidebar.classList.remove('open');
  if(key==='PaymentSettings') return renderV5PaymentSettings();
  if(key==='NotificationSettings') return renderV5NotificationSettings();
  if(key==='ThemeSettings') return renderV5ThemeCustomizer();
  if(key==='ContentSections') return renderV5ContentEditor();
  if(key==='MediaLibrary') return renderV5MediaLibrary();
  if(key==='SetupWizard') return renderV5SetupWizard();
  if(key==='MaintenanceSettings') return renderV5Maintenance();
  if(key==='TermsSettings') return renderV5Terms();
  if(key==='Reports') return renderV5Reports();
  if(key==='Help') return renderV5Help();
  return OLD_V4_loadPage(key);
}

function v5PhonePreview(title='Thai Spa'){
  return `<div class="v5-phone-preview"><div class="v5-phone-screen"><div class="v5-phone-hero"></div><b>${esc(title)}</b><div class="v5-phone-line" style="width:88%"></div><div class="v5-phone-line" style="width:62%"></div><div class="v5-phone-card"></div><div class="v5-phone-card"></div><button class="btn" style="width:100%">จองคิว</button></div></div>`;
}

async function renderV5PaymentSettings(){
  const res=await api('adminList',{sheet:'PaymentSettings'}); rows=res.rows||[]; headers=res.headers||[];
  const get=k=>(rows.find(x=>x.key===k)||{}).value||'';
  content.innerHTML=v4Hero('ตั้งค่าการชำระเงิน','ตั้งค่า QR Code / PromptPay, Omise / Opn, Cloudinary และทดสอบการเชื่อมต่อก่อนใช้งานจริง')+
  `<div class="v5-split">
    <div class="grid">
      <div class="card">
        <h3><span class="v5-status-dot ${get('enableQrPayment')==='FALSE'?'off':''}"></span>QR Code / PromptPay</h3>
        <div class="grid two">${payField('enableQrPayment','เปิด QR Code',get('enableQrPayment')||'TRUE')}${payField('promptPayName','ชื่อบัญชี',get('promptPayName'))}</div>
        ${payField('qrImageUrl','QR Image URL',get('qrImageUrl'))}
        <div class="toolbar"><button class="btn" onclick="savePayment()">บันทึก QR</button></div>
      </div>
      <div class="card">
        <h3><span class="v5-status-dot ${get('enableCardPayment')==='FALSE'?'off':''}"></span>Omise / Opn Card Payment</h3>
        <div class="grid two">${payField('enableCardPayment','เปิดบัตรเครดิต',get('enableCardPayment')||'TRUE')}${payField('omisePublicKey','Public Key',get('omisePublicKey'))}</div>
        <div class="field"><label>Secret Key</label><input id="pay_omiseSecretKey" placeholder="sk_test_... / sk_live_..."></div>
        <div class="notice">Secret Key จะถูกส่งไปเก็บใน Apps Script PropertiesService ไม่แสดงบน HTML</div>
        <div class="toolbar"><button class="btn" onclick="savePayment(true)">บันทึก Secret</button><button class="btn alt" onclick="testConnection('omise')">Test Omise</button></div>
      </div>
      <div class="card">
        <h3><span class="v5-status-dot"></span>Cloudinary Upload</h3>
        <div class="grid two">${payField('cloudinaryCloudName','Cloud Name',get('cloudinaryCloudName'))}${payField('cloudinaryUploadPreset','Unsigned Upload Preset',get('cloudinaryUploadPreset'))}</div>
        <div class="toolbar"><button class="btn" onclick="savePayment()">บันทึก Cloudinary</button><button class="btn alt" onclick="testConnection('cloudinary')">Test Cloudinary</button><button class="btn alt" onclick="loadPage('MediaLibrary')">ไปคลังรูป</button></div>
      </div>
    </div>
    <div class="card"><h3>Preview หน้าชำระเงิน</h3>${v5PhonePreview('เลือกวิธีชำระเงิน')}<div class="v5-checklist"><div class="v5-check"><div class="mark">✓</div><div><b>QR / Slip</b><br><span class="mini">รองรับอัปโหลดสลิปและ Auto Confirm</span></div></div><div class="v5-check"><div class="mark">✓</div><div><b>Omise Token</b><br><span class="mini">ไม่เก็บเลขบัตรในเว็บ</span></div></div></div></div>
  </div>`;
}

async function renderV5NotificationSettings(){
  const res=await api('adminList',{sheet:'NotificationSettings'}); rows=res.rows||[]; headers=res.headers||[];
  const row=ch=>rows.find(r=>r.channel===ch)||{};
  content.innerHTML=v4Hero('ตั้งค่าการแจ้งเตือน','เปิด/ปิด LINE, Telegram, Email และทดสอบการส่งแจ้งเตือนจากหลังบ้าน')+
  `<div class="grid three">${['telegram','line','email'].map(ch=>{const r=row(ch);return `<div class="card"><h3>${ch.toUpperCase()}</h3><p><span class="v5-status-dot ${String(r.isEnabled)==='TRUE'?'':'off'}"></span>${String(r.isEnabled)==='TRUE'?'เปิดใช้งาน':'ปิดอยู่'}</p><div class="field"><label>เปิดใช้งาน</label><select id="${ch}_enabled"><option value="TRUE" ${r.isEnabled==='TRUE'?'selected':''}>TRUE</option><option value="FALSE" ${r.isEnabled!=='TRUE'?'selected':''}>FALSE</option></select></div><div class="field"><label>Token / Config</label><input id="${ch}_token" value="${esc(r.token||'')}" placeholder="Token"></div><div class="field"><label>Target / Chat ID / Email</label><input id="${ch}_target" value="${esc(r.target||'')}" placeholder="Target"></div><div class="toolbar"><button class="btn" onclick="saveNotification('${ch}')">บันทึก</button><button class="btn alt" onclick="testConnection('${ch}')">Test</button></div></div>`}).join('')}</div>
  <br><div class="card"><h3>Template แจ้งเตือน</h3><p class="muted">รองรับตัวแปร เช่น {{bookingId}}, {{fullName}}, {{serviceName}}, {{bookingDate}}, {{startTime}}</p><button class="btn alt" onclick="renderSheetPage('NotificationTemplates')">เปิด Template แบบตาราง</button></div>`;
}

async function renderV5ThemeCustomizer(){
  const res=await api('publicData'); const th=(res.data&&res.data.theme)||{};
  content.innerHTML=v4Hero('Theme & Color Customizer','เลือกธีมสำเร็จรูป แล้วเปลี่ยนเฉพาะโค้ดสี HEX โดยลายและสไตล์ของธีมยังอยู่')+
  `<div class="v5-split">
    <div class="card"><h3>Theme Preset</h3><div class="grid two">
      ${[
        ['Thai Spa Premium','#8B5E3C'],['Herbal Green','#3A5A40'],['Minimal Cream','#B08968'],['Luxury Black Gold','#111111'],['Spa Rose','#A26769'],['Clean Blue','#426A8C'],['Aroma Purple','#6D597A']
      ].map(t=>`<button class="btn alt" onclick="applyThemePreset('${t[0]}','${t[1]}')"><span class="theme-swatch" style="background:${t[1]}"></span>${t[0]}</button>`).join('')}
      </div><hr><h3>ปรับสีเอง</h3><div class="color-inputs">${['primaryColor','secondaryColor','accentColor','backgroundColor','textColor','cardColor'].map(k=>`<div class="field"><label>${k}</label><input id="theme_${k}" value="${esc(th[k]||'')}"></div>`).join('')}</div><div class="toolbar"><button class="btn" onclick="saveTheme()">บันทึก</button><button class="btn alt" onclick="testThemePreview()">Preview</button><button class="btn alt" onclick="applyThemePreset('Thai Spa Premium','#8B5E3C')">Reset</button></div></div>
    <div class="theme-preview"><h2 style="color:#fff">Live Theme Preview</h2><p>ตัวอย่างปุ่ม การ์ด และสีหลักของเว็บไซต์</p><button class="btn secondary">ปุ่มตัวอย่าง</button><div class="preview-card"><b>Service Card</b><p class="muted">ลายธีมยังอยู่ เปลี่ยนเฉพาะสีตาม HEX</p></div>${v5PhonePreview('Theme Preview')}</div>
  </div>`;
}

async function renderV5ContentEditor(){
  const res=await api('adminList',{sheet:'ContentSections'}); rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML=v4Hero('Content Editor / แก้ไขเนื้อหาเว็บไซต์','แก้ข้อความ รูปภาพ ปุ่ม เมนู และ Section ได้จากหลังบ้าน พร้อมเปิดหน้าเว็บเพื่อใช้ Admin Edit Mode')+
  `<div class="settings-panel">
    <div class="settings-menu"><button class="btn" onclick="openCustomer()">เปิดหน้าเว็บจริง</button><button class="btn alt" onclick="openEdit()">เพิ่ม Section</button><button class="btn alt" onclick="loadPage('ThemeSettings')">ตั้งค่าธีม</button><button class="btn alt" onclick="loadPage('MediaLibrary')">คลังรูป</button></div>
    <div class="card">${rows.map(r=>`<div class="v5-service-row"><div class="avatar" style="background-image:url('${esc(r.imageUrl||'')}')"></div><div><b>${esc(r.title||r.sectionKey)}</b><p class="mini">${esc(r.page||'')} / ${esc(r.sectionKey)}<br>${esc(r.subtitle||r.text||'')}</p></div><button class="btn alt" onclick='openEdit(${JSON.stringify(r).replace(/'/g,"&#39;")})'>แก้ไข</button></div>`).join('')||'<div class="v5-empty">ยังไม่มี Section</div>'}</div>
  </div>`;
}

async function renderV5MediaLibrary(){
  const res=await api('adminList',{sheet:'MediaLibrary'}); rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML=v4Hero('Media Library / ระบบอัปโหลดรูปภาพกลาง','อัปโหลด จัดหมวดหมู่ และนำ URL รูปไปใช้กับ Logo, Banner, Gallery, Review, Promotion, Services, Branches และ Staff')+
  `<div class="v5-split"><div class="card"><h3>อัปโหลดรูป</h3><div class="upload-preview" id="uploadPreview">Preview</div><br><input type="file" id="uploadFile" accept="image/*" onchange="previewFile()"><div class="field"><label>หมวดหมู่</label><select id="uploadCategory"><option>Logo</option><option>Banner</option><option>Gallery</option><option>Reviews</option><option>Promotions</option><option>Services</option><option>Branches</option><option>Staff</option></select></div><button class="btn" onclick="uploadToCloudinary()">Upload to Cloudinary</button><button class="btn alt" onclick="testConnection('cloudinary')">Test Cloudinary</button></div>
  <div class="card"><h3>รายการรูปล่าสุด</h3><div class="media-grid">${rows.slice(-12).reverse().map(r=>`<div class="media-card"><div class="img" style="background-image:url('${esc(r.url||'')}')"></div><div class="body"><b>${esc(r.category||'Image')}</b><p class="mini">${esc(r.fileName||r.mediaId)}</p><button class="btn alt" onclick="navigator.clipboard.writeText('${esc(r.url||'')}')">Copy URL</button></div></div>`).join('')||'<div class="v5-empty">ยังไม่มีรูป</div>'}</div></div></div>`;
}

function renderV5SetupWizard(){
  const steps=['ข้อมูลร้าน','โลโก้และ Banner','เลือกธีม','เพิ่มสาขา','เพิ่มบริการ','เพิ่มพนักงาน','ตั้งตารางงาน','ชำระเงิน','แจ้งเตือน','เปิดใช้งาน'];
  content.innerHTML=v4Hero('Setup Wizard','ตั้งค่าระบบครั้งแรกแบบทีละขั้น เหมาะสำหรับส่งมอบให้ลูกค้าใช้งานเอง')+
  `<div class="card"><h3>ความคืบหน้าการตั้งค่า</h3><div class="v5-setup-progress"><span></span></div><br><div class="wizard-steps">${steps.map((s,i)=>`<div class="wizard-step"><b>${i+1}</b>${s}<br><button class="btn alt" onclick="${wizardAction(i)}">ตั้งค่า</button></div>`).join('')}</div></div>`;
}
function wizardAction(i){return ["loadPage('ContentSections')","loadPage('MediaLibrary')","loadPage('ThemeSettings')","loadPage('Branches')","loadPage('Services')","loadPage('Staff')","loadPage('StaffSchedules')","loadPage('PaymentSettings')","loadPage('NotificationSettings')","openCustomer()"][i]}

async function renderV5Maintenance(){
  const res=await api('adminList',{sheet:'MaintenanceSettings'}); rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML=v4Hero('Maintenance Mode','เปิด/ปิดระบบชั่วคราว แก้ข้อความ รูปภาพ และปุ่มติดต่อที่แสดงกับลูกค้า')+
  `<div class="v5-split"><div class="card">${renderTable(rows)}<button class="btn" onclick="openEdit()">เพิ่ม/แก้ค่า</button></div><div class="card"><h3>Preview หน้าปิดปรับปรุง</h3><div class="theme-preview"><h2 style="color:#fff">ขณะนี้ระบบปิดปรับปรุง</h2><p>กรุณาติดต่อร้านผ่าน LINE หรือโทรสอบถามโดยตรง</p><button class="btn secondary">ติดต่อร้าน</button></div></div></div>`;
}

async function renderV5Terms(){
  const res=await api('adminList',{sheet:'TermsSettings'}); rows=res.rows||[]; headers=res.headers||[];
  content.innerHTML=v4Hero('Terms / Privacy Consent','จัดการเงื่อนไขการจอง Privacy Policy, Cancellation Policy และ Refund Policy')+
  `<div class="grid two">${rows.map(r=>`<div class="card"><h3>${esc(r.title||r.key)}</h3><p class="muted">${esc(String(r.content||'').slice(0,220))}</p><span class="status">${esc(r.isEnabled||'TRUE')}</span><br><br><button class="btn alt" onclick='openEdit(${JSON.stringify(r).replace(/'/g,"&#39;")})'>แก้ไข</button></div>`).join('')||'<div class="v5-empty">ยังไม่มีเงื่อนไข</div>'}</div>`;
}

async function renderV5Reports(){
  const res=await api('dashboard'); const s=(res.stats||{});
  content.innerHTML=v4Hero('Export / Report / Activity Logs','ดูรายงานยอดจอง รายได้ ลูกค้า สาขา บริการ พนักงาน และ Export Backup')+
  `<div class="report-grid"><div class="card"><h3>รายงานยอดจอง</h3>${barChart(s.daily||[])}</div><div class="card"><h3>สรุปตัวเลข</h3><div class="kpi">${s.totalBookings||0}</div><p class="muted">ยอดจองทั้งหมด</p><div class="toolbar"><button class="btn" onclick="exportBackup()">Export Backup</button><button class="btn alt" onclick="loadPage('ActivityLogs')">Activity Logs</button></div></div></div><br><div class="grid three"><div class="card"><h3>รายงานสาขา</h3><p class="muted">Export จาก Bookings</p></div><div class="card"><h3>รายงานบริการ</h3><p class="muted">บริการที่ถูกจองมากสุด</p></div><div class="card"><h3>รายงานพนักงาน</h3><p class="muted">พนักงานที่ถูกจองมากสุด</p></div></div>`;
}

function renderV5Help(){
  const items=['ตั้งค่าร้านครั้งแรก','เพิ่มบริการและราคา','เพิ่มสาขา','เพิ่มพนักงาน','ตั้งตารางงาน','ตรวจสลิปและยืนยันจอง','เลื่อนการจอง','เปลี่ยนธีมและสี','เปิด/ปิดฟังก์ชัน','ตั้งค่า Omise / Cloudinary / LINE / Telegram','Backup / Restore','Export รายงาน','Admin Edit Mode','Capacity Limit','Required Field Control'];
  content.innerHTML=v4Hero('คู่มือการใช้งานในหน้าแอดมิน','รวมวิธีใช้งานระบบหลักทั้งหมด ลดการพึ่งพาผู้พัฒนาหลังส่งมอบ')+
  `<div class="grid three">${items.map((t,i)=>`<div class="card"><h3>${i+1}. ${t}</h3><p class="muted">ดูขั้นตอนละเอียดในไฟล์ README_SETUP_TH.txt ที่แนบใน ZIP</p><div class="v5-check"><div class="mark">✓</div><div>พร้อมใช้เป็นคู่มือส่งมอบ</div></div></div>`).join('')}</div>`;
}
