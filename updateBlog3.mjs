import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const iconAlert = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B22300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-1"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
const iconCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const iconArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
const iconInfo = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B22300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

const blogContent = `
<p class="lead text-lg mb-8">İkinci el araç piyasası her geçen gün dijitalleşiyor ve hızlanıyor. 2026 yılı itibarıyla, hasarlı, kazalı veya pert araç satışı artık sanayi köşelerinde günlerce pazarlık yapılarak değil, kurumsal değerleme firmaları aracılığıyla saniyeler içinde tamamlanıyor. Eğer aracınız kaza yaptıysa ve hasarlı bir şekilde elden çıkarmayı düşünüyorsanız, zarar etmemek ve hukuki güvenliğinizi sağlamak için bilmeniz gereken <strong>en kritik 5 ipucunu</strong> sizin için derledik.</p>

<div style="margin: 48px 0; text-align: center;">
  <img src="/images/blog/blog3_modern_inspection.png" alt="2026 Teknolojisiyle Dijital Araç Değerleme" style="width: 100%; max-width: 800px; max-height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;" />
  <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 16px; font-style: italic;">Oto Grade'in dijital değerleme altyapısı sayesinde aracınızın güncel hurda ve sovtaj değeri anında hesaplanır.</p>
</div>

<h3>1. Dijital Teklif Altyapılarını Kullanın</h3>
<p>Geçmişte hasarlı aracınızı satmak için çekiciyle sanayi sanayi gezmeniz veya telefonla düzinelerce yeri arayıp fotoğrafları WhatsApp'tan göndermeniz gerekirdi. 2026 yılında ise <strong>akıllı fiyatlandırma algoritmaları</strong> sayesinde, aracınızın fotoğraflarını ve kaza durumunu sisteme yüklediğiniz anda kurumsal firmalar size en net teklifi sunabiliyor.</p>
<p>Oto Grade olarak, web sitemiz üzerinden <a href="/tr/teklif-al" style="color: #B22300; font-weight: 500; text-decoration: underline;">online fiyat teklifi</a> alma sürecini tamamen dijitalleştirdik. Evinizden çıkmadan aracınızın değerini öğrenebilirsiniz.</p>

<h3>2. Hasarı Gizlemeye Çalışmayın</h3>
<p>Araç sahiplerinin en sık yaptığı hata, daha yüksek bir fiyat alabilmek umuduyla ekspertiz raporlarını veya kaza anı fotoğraflarını saklamaktır. Günümüzde modern diagnostik cihazları ve kurumsal ekspertiz uzmanları, aracın geçmişteki en ufak şasi düzeltmesini veya hava yastığı açılmasını bile anında tespit edebilmektedir.</p>

<ul style="list-style: none; padding-left: 0; margin-top: 24px;">
  <li style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px;">
    ${iconInfo}
    <span><strong style="color: #1a1c1c;">Şeffaflık Kazandırır:</strong> Aracınızın hasarını net ve dürüst bir şekilde beyan etmeniz, değerleme sürecini hızlandırır ve satış anında fiyattan kesinti yapılması riskini ortadan kaldırır. Fotoğrafları çekerken hasarlı bölgeleri özellikle net bir şekilde gösterin.</span>
  </li>
</ul>

<!-- INFOGRAPHIC BLOCK -->
<div style="margin: 64px 0; background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
  <div style="background-color: #fafafa; padding: 24px; border-bottom: 1px solid #e2e2e2;">
    <h3 style="font-size: 20px; font-weight: 700; color: #1a1c1c; margin: 0; text-align: center; display: flex; align-items: center; justify-content: center; gap: 12px;">
      ${iconCheck} Başarılı Satış İçin Hazırlanması Gereken Evraklar
    </h3>
  </div>
  <div style="padding: 32px;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 24px; text-align: left;">
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #e5e2e1; color: #1a1c1c; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">1</div>
        <div>
          <h4 style="font-weight: bold; font-size: 15px; color: #1a1c1c; margin: 0 0 4px 0;">Araç Ruhsatı</h4>
          <p style="font-size: 13px; color: #666666; margin: 0; line-height: 1.4;">Aracın adınıza kayıtlı olduğunu gösteren asıl belge.</p>
        </div>
      </div>
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #e5e2e1; color: #1a1c1c; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">2</div>
        <div>
          <h4 style="font-weight: bold; font-size: 15px; color: #1a1c1c; margin: 0 0 4px 0;">Tramer (Hasar) Kaydı</h4>
          <p style="font-size: 13px; color: #666666; margin: 0; line-height: 1.4;">Geçmiş kaza ve onarım bilgilerini içeren döküm.</p>
        </div>
      </div>
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #e5e2e1; color: #1a1c1c; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">3</div>
        <div>
          <h4 style="font-weight: bold; font-size: 15px; color: #1a1c1c; margin: 0 0 4px 0;">Borcu Yoktur Yazısı</h4>
          <p style="font-size: 13px; color: #666666; margin: 0; line-height: 1.4;">MTV, trafik cezası veya HGS borçlarının kapatılması.</p>
        </div>
      </div>
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #e5e2e1; color: #1a1c1c; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">4</div>
        <div>
          <h4 style="font-weight: bold; font-size: 15px; color: #1a1c1c; margin: 0 0 4px 0;">Çekme Belgesi</h4>
          <p style="font-size: 13px; color: #666666; margin: 0; line-height: 1.4;">Ağır hasarlı araçlar için noterden alınacak trafikten çekme belgesi.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<h3>3. Nakliye (Çekici) Maliyetlerini Kimin Karşılayacağını Netleştirin</h3>
<p>2026 piyasasında lojistik maliyetleri oldukça yüksektir. Eğer aracınız yürür durumda değilse, satacağınız firmaya aracı götürmek binlerce liralık bir çekici faturası çıkarabilir. Satış yapacağınız kurumsal firmanın bu maliyeti karşılayıp karşılamadığını mutlaka sorun. Oto Grade, <a href="/tr/hizmet/kazali-arac-alimi" style="color: #B22300; font-weight: 500; text-decoration: underline;">kazalı araç alımında</a> Türkiye'nin her yerinden kendi çekici filosuyla aracınızı <strong>ücretsiz</strong> teslim alır.</p>

<h3>4. Hukuki Güvenlikten Ödün Vermeyin</h3>
<p>Kazalı aracınızı bireysel bir alıcıya veya mahalle arası bir tamirciye satmak, gelecekte başınıza büyük hukuki işler açabilir. Araç sizin üzerinizdeyken bir suça karışırsa, veya tamir edilip ayıplı mal olarak bir başkasına satılırsa yasal sorumluluk size ait olacaktır.</p>

<div style="margin: 48px 0; text-align: center;">
  <img src="/images/blog/blog3_digital_contract.png" alt="Oto Grade Kurumsal Satış Süreci ve Noter Güvencesi" style="width: 100%; max-width: 800px; max-height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;" />
  <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 16px; font-style: italic;">Oto Grade, satış sözleşmelerini şeffaf bir şekilde yönetir ve ödemenizi noterde imza atmadan saniyeler önce güvenle hesabınıza geçirir.</p>
</div>

<h3>5. Resmi Kurumsal Firmaları Tercih Edin</h3>
<p>Kurumsal hurda ve pert araç alım firmaları (Oto Grade gibi), devlete karşı vergi yükümlülükleri olan, resmi "Çevre ve Şehircilik Bakanlığı" standartlarına veya yasal ekspertiz kurallarına uygun hareket eden şirketlerdir. Bireysel satışlarda yaşayacağınız "Fiyat kırma, parayı eksik yatırma, notere gelmeme" gibi stresli durumların hiçbirini kurumsal bir muhatapla yaşamazsınız.</p>

<!-- HIGH CONVERSION CTA -->
<div style="margin: 64px 0; background-color: #1a1c1c; border-radius: 24px; padding: 56px 32px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
  <div style="position: absolute; inset: 0; opacity: 0.15; background: radial-gradient(circle at center, #B22300 0%, transparent 70%);"></div>
  <div style="position: relative; z-index: 10;">
    <h3 style="font-size: 32px; font-weight: bold; color: #ffffff; margin: 0 0 16px 0; line-height: 1.2;">2026 Standartlarında<br />Hızlı ve Güvenilir Satış</h3>
    <p style="color: #e5e2e1; margin: 0 auto 32px auto; max-width: 600px; font-size: 16px; line-height: 1.6;">Oto Grade'in dijital değerleme altyapısıyla tanışın. Hasarlı aracınızın fotoğraflarını yükleyin, anında nakit teklifinizi alın ve aracınızı aynı gün içinde kapınızdan teslim edelim.</p>
    <a href="/tr/teklif-al" style="display: inline-flex; align-items: center; justify-content: center; background-color: #B22300; color: #ffffff; padding: 16px 40px; border-radius: 9999px; font-weight: bold; font-size: 16px; text-decoration: none; box-shadow: 0 0 20px rgba(178, 35, 0, 0.5); transition: opacity 0.2s;">
      Hemen Ücretsiz Fiyat Teklifi Alın ${iconArrow}
    </a>
  </div>
</div>
`;

async function run() {
  console.log("Updating Blog 3...");
  const { error } = await supabase
    .from("hazaral_blogs")
    .update({ 
      content: blogContent,
      image_url: '/images/blog/blog3_modern_inspection.png',
      excerpt: "İkinci el araç piyasası dijitalleşiyor! Hasarlı veya pert aracınızı satarken zarar etmemek ve hukuki güvenliğinizi sağlamak için bilmeniz gereken en kritik 5 ipucu."
    })
    .eq("slug", "2026-hasarli-arac-satarken-5-ipucu");

  if (error) {
    console.error("Failed to update blog:", error);
    process.exit(1);
  }
  
  console.log("Successfully updated Blog 3 with ultra-rich HTML!");
}

run();
