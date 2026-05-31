import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const iconCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const iconArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
const iconShield = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
const iconFileText = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`;
const iconBanknote = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>`;

const blogContent = `
<p class="lead text-lg mb-8">Aracınızın ciddi bir kaza geçirmesi yeterince sarsıcı bir durumken, ardından gelen sigorta işlemleri, hasar tespiti ve aracın akıbetine karar verme süreci çoğu araç sahibi için stresli bir labirente dönüşebilir. Kaza sonrası aracınız <strong>sigorta şirketi tarafından "pert" (tam hasarlı) ilan edildiğinde</strong> haklarınızı bilmek ve doğru adımları atmak, maddi zararınızı en aza indirmeniz için hayati önem taşır. İşte Oto Grade uzmanlarından adım adım pert süreci rehberi.</p>

<div style="margin: 48px 0; text-align: center;">
  <img src="/images/blog/blog5_total_loss.png" alt="Oto Grade Pert Araç Değerleme Uzmanı" style="width: 100%; max-width: 800px; max-height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;" />
  <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 16px; font-style: italic;">Bir aracın pert kabul edilmesi için hasar onarım maliyetinin aracın piyasa rayiç bedelinin yaklaşık %70'ini aşması gerekir.</p>
</div>

<h3>1. "Pert" (Tam Hasarlı) Kararı Nasıl Verilir?</h3>
<p>Kaza sonrasında aracınız yetkili veya özel bir servise çekilir. Sigorta şirketinin atadığı bağımsız eksper, araçtaki hasarın detaylı bir listesini ve onarım maliyetini çıkarır. Çıkan onarım faturası, aracın kaza öncesi 2. el piyasa değerinin (rayiç bedelinin) ekonomik olarak onarılamayacak kadar yüksek bir oranına ulaşıyorsa (genellikle %70 ve üzeri), sigorta şirketi aracı "tam hasarlı" yani pert olarak değerlendirir.</p>

<h3>2. Rayiç Bedel Belirleme ve Sigorta Teklifi</h3>
<p>Araç pert ilan edildikten sonra sigorta şirketi, piyasa araştırması yaparak aracın kaza anından hemen önceki değerini belirler ve size bir ödeme teklifi sunar. Bu aşamada karşınıza iki farklı senaryo çıkar:</p>

<ul style="list-style: none; padding-left: 0; margin-top: 24px;">
  <li style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px;">
    ${iconShield}
    <span><strong style="color: #1a1c1c;">Senaryo A (Aracı Sigortaya Bırakmak):</strong> Sigorta şirketinin belirlediği rayiç bedeli kabul edersiniz. Sigorta şirketi tüm parayı hesabınıza yatırır ve aracın mülkiyetini (hurdasını) devralarak kendisi satar. Bu en zahmetsiz ama bazen en düşük karlı yoldur.</span>
  </li>
  <li style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px;">
    ${iconShield}
    <span><strong style="color: #1a1c1c;">Senaryo B (Aracı Kendiniz Satmak - Mutabakat):</strong> Sigorta şirketi size "hasar bedelini" (rayiç bedel eksi hurda bedeli) öder ve hasarlı aracı size bırakır. Siz de aracı <strong>Oto Grade gibi kurumsal firmalara</strong> satarak sigortadan alacağınız toplam tutarın çok daha üzerine çıkabilirsiniz.</span>
  </li>
</ul>

<!-- INFOGRAPHIC BLOCK -->
<div style="margin: 64px 0; background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
  <div style="background-color: #fafafa; padding: 24px; border-bottom: 1px solid #e2e2e2;">
    <h3 style="font-size: 20px; font-weight: 700; color: #1a1c1c; margin: 0; text-align: center; display: flex; align-items: center; justify-content: center; gap: 12px;">
      ${iconCheck} Pert Aracı Neden Oto Grade'e Satmalısınız?
    </h3>
  </div>
  <div style="padding: 32px;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; text-align: center;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; color: #1a1c1c; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">
          ${iconBanknote}
        </div>
        <h4 style="font-weight: bold; font-size: 16px; color: #1a1c1c; margin: 0 0 8px 0;">Daha Yüksek Kazanç</h4>
        <p style="font-size: 13px; color: #666666; margin: 0; line-height: 1.5;">Sigorta şirketinin biçtiği düşük "sovtaj" bedeli yerine, serbest piyasa koşullarında aracınızın gerçek değerini alırsınız.</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; color: #1a1c1c; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">
          ${iconFileText}
        </div>
        <h4 style="font-weight: bold; font-size: 16px; color: #1a1c1c; margin: 0 0 8px 0;">Evrak İşleri Sıfır Stres</h4>
        <p style="font-size: 13px; color: #666666; margin: 0; line-height: 1.5;">Noter, çekme belgesi ve trafikten düşürme gibi tüm karmaşık bürokratik işlemler Oto Grade uzmanlarınca ücretsiz yönetilir.</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; color: #1a1c1c; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        </div>
        <h4 style="font-weight: bold; font-size: 16px; color: #1a1c1c; margin: 0 0 8px 0;">Aynı Gün Ödeme</h4>
        <p style="font-size: 13px; color: #666666; margin: 0; line-height: 1.5;">Aracın fotoğraflarını gönderdikten saatler sonra ödemeniz EFT ile hesabınıza geçer.</p>
      </div>
    </div>
  </div>
</div>

<h3>3. Doğru Çözüm Ortağını Bulmak</h3>
<p>Aracı kendiniz satmaya karar verdiğinizde, en büyük zorluk güvenilir bir alıcı bulmaktır. İnternet üzerinden bireysel ilan açtığınızda yüzlerce ciddiyetsiz telefon, mantıksız teklifler ve dolandırıcılık riskleriyle uğraşmak zorunda kalırsınız.</p>

<div style="margin: 48px 0; text-align: center;">
  <img src="/images/blog/blog5_insurance_agent.png" alt="Oto Grade ile Stresiz Pert Araç Satış Süreci" style="width: 100%; max-width: 800px; max-height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;" />
  <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 16px; font-style: italic;">Süreci profesyonellere bırakın. Oto Grade, kaza sonrası stresi ortadan kaldırarak size şeffaf bir satış deneyimi sunar.</p>
</div>

<p>Oto Grade ile <a href="/tr/hizmet/pert-arac-alimi" style="color: #B22300; font-weight: 500; text-decoration: underline;">pert araç satışı</a>, son derece şeffaf ve güvenlidir. Aracınız bulunduğu yerden ücretsiz çekici ile alınır, anlaşılan rakam anında nakit olarak ödenir ve tüm yasal devir işlemleri noter onaylı olarak aynı gün tamamlanır.</p>

<!-- HIGH CONVERSION CTA -->
<div style="margin: 64px 0; background-color: #1a1c1c; border-radius: 24px; padding: 56px 32px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
  <div style="position: absolute; inset: 0; opacity: 0.15; background: radial-gradient(circle at center, #B22300 0%, transparent 70%);"></div>
  <div style="position: relative; z-index: 10;">
    <h3 style="font-size: 32px; font-weight: bold; color: #ffffff; margin: 0 0 16px 0; line-height: 1.2;">Pert Aracınızı Sigortaya Vermeden Önce<br />Bizden Fiyat Alın!</h3>
    <p style="color: #e5e2e1; margin: 0 auto 32px auto; max-width: 600px; font-size: 16px; line-height: 1.6;">Sigorta şirketinin "sovtaj" bedeliyle yetinmeyin. Aracınızın güncel durumunu bizimle paylaşın, gerçek serbest piyasa değerini ücretsiz hesaplayıp anında ödeyelim.</p>
    <a href="/tr/teklif-al" style="display: inline-flex; align-items: center; justify-content: center; background-color: #B22300; color: #ffffff; padding: 16px 40px; border-radius: 9999px; font-weight: bold; font-size: 16px; text-decoration: none; box-shadow: 0 0 20px rgba(178, 35, 0, 0.5); transition: opacity 0.2s;">
      Hemen Ücretsiz Fiyat Teklifi Alın ${iconArrow}
    </a>
  </div>
</div>
`;

async function run() {
  console.log("Updating Blog 5...");
  const { error } = await supabase
    .from("hazaral_blogs")
    .update({ 
      content: blogContent,
      image_url: '/images/blog/blog5_total_loss.png',
      excerpt: "Sigorta şirketi tarafından pert ilan edilen aracınızı nasıl satabilirsiniz? Aracı sigortaya bırakmak mı yoksa kendiniz satmak mı daha karlı? Pert süreci yönetimi rehberi."
    })
    .eq("slug", "araciniz-kaza-sonrasi-pert-oldugunda-ne-yapmalisiniz");

  if (error) {
    console.error("Failed to update blog:", error);
    process.exit(1);
  }
  
  console.log("Successfully updated Blog 5 with ultra-rich HTML!");
}

run();
