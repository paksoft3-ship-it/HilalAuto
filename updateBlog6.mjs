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
const iconZap = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
const iconShieldCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1 6.5 2a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`;

const blogContent = `
<p class="lead text-lg mb-8">Aracınızın kaza yapması ve ağır hasar alması, maddi kaybın ötesinde ciddi bir zaman ve enerji kaybı anlamına gelir. Sanayi sitelerinde ekspertiz sırası beklemek, çekici firmalarıyla pazarlık yapmak ve güvenilir bir alıcı bulmaya çalışmak günlerinizi, hatta haftalarınızı alabilir. Ancak modern dijital çözümler sayesinde bu süreç artık çok farklı. <strong>Oto Grade</strong> ile hasarlı, pert veya hurda aracınızı aynı gün içinde, hiçbir strese girmeden satmanın eşsiz avantajlarını keşfedin.</p>

<div style="margin: 48px 0; text-align: center;">
  <img src="/images/blog/blog6_happy_customer.png" alt="Oto Grade Müşteri Memnuniyeti ve Güven" style="width: 100%; max-width: 800px; max-height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;" />
  <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 16px; font-style: italic;">Oto Grade'in şeffaf süreçleri sayesinde, aracınızın değeri saniyeler içinde hesaplanır ve satış sonrası yüzünüz güler.</p>
</div>

<h3>1. "Zaman Eşittir Para" İlkesi</h3>
<p>Kazalı aracınızı bir otoparkta beklettiğiniz her gün, cebinizden çıkan ekstra <strong>otopark ücreti</strong> demektir. Üstelik aracın hurda piyasasındaki değeri (sovtaj değeri), döviz kurlarına ve piyasa dinamiklerine göre anlık olarak değişebilir. Oto Grade'in aynı gün satış garantisi, aracınızın değerinin beklemeden nakde dönüşmesini sağlayarak sizi ekstra maliyetlerden korur.</p>

<h3>2. Tek Tıkla Türkiye'nin Her Yerinden Teklif Alın</h3>
<p>Eskiden aracınızı satmak için birden fazla fiziki ekspere gitmeniz veya aracınızı farklı şehirlere taşımanız gerekirdi. Artık Oto Grade'in dijital değerleme sistemi sayesinde, akıllı telefonunuzdan aracın fotoğraflarını ve kaza bilgilerini yüklemeniz yeterli. Uzman ekibimiz saniyeler içinde aracınızı inceler ve size anında piyasa standartlarında, bağlayıcı bir nakit teklifi sunar.</p>

<!-- INFOGRAPHIC BLOCK -->
<div style="margin: 64px 0; background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
  <div style="background-color: #fafafa; padding: 24px; border-bottom: 1px solid #e2e2e2;">
    <h3 style="font-size: 20px; font-weight: 700; color: #1a1c1c; margin: 0; text-align: center; display: flex; align-items: center; justify-content: center; gap: 12px;">
      ${iconCheck} Neden "Aynı Gün" Satış?
    </h3>
  </div>
  <div style="padding: 32px;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; text-align: center;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; color: #1a1c1c; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">
          ${iconZap}
        </div>
        <h4 style="font-weight: bold; font-size: 16px; color: #1a1c1c; margin: 0 0 8px 0;">Otopark Masrafına Son</h4>
        <p style="font-size: 13px; color: #666666; margin: 0; line-height: 1.5;">Sanayi ve yedi-emin otoparklarında biriken günlük yüksek ücretleri anında durdurursunuz.</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; color: #1a1c1c; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
        </div>
        <h4 style="font-weight: bold; font-size: 16px; color: #1a1c1c; margin: 0 0 8px 0;">Değer Kaybını Önleyin</h4>
        <p style="font-size: 13px; color: #666666; margin: 0; line-height: 1.5;">Açık alanda bekleyen aracın çürümesi ve parça paslanması riskini sıfıra indirirsiniz.</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; color: #1a1c1c; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">
          ${iconShieldCheck}
        </div>
        <h4 style="font-weight: bold; font-size: 16px; color: #1a1c1c; margin: 0 0 8px 0;">Bürokratik Rahatlık</h4>
        <p style="font-size: 13px; color: #666666; margin: 0; line-height: 1.5;">Kasko iptali, MTV borcu kapama ve noterdeki çekme belgesi işlemleri aynı gün aradan çıkar.</p>
      </div>
    </div>
  </div>
</div>

<h3>3. Güvenli Ödeme Altyapısı: Noterden Önce Paranızı Görün</h3>
<p>Bireysel satışların en stresli anı, noterde imza atarken ödemenin yapılıp yapılmayacağıdır. Oto Grade, Türkiye'nin önde gelen kurumsal firmalarından biri olarak, ödeme süreçlerini tamamen yasal güvence altına almıştır.</p>

<div style="margin: 48px 0; text-align: center;">
  <img src="/images/blog/blog6_fast_transfer.png" alt="Oto Grade Anında EFT/Havale İşlemi" style="width: 100%; max-width: 800px; max-height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;" />
  <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 16px; font-style: italic;">Noter memuruna "evet" demeden saniyeler önce, anlaşılan net tutar doğrudan banka hesabınıza güvenle transfer edilir.</p>
</div>

<p>Satış günü noter işlemleriniz başlatılırken, Oto Grade finans departmanı anlaştığımız net satış bedelini, aracı satan ruhsat sahibinin banka hesabına EFT/Havale yoluyla gönderir. Hesap ekstrenizde bakiyeyi gördükten sonra gönül rahatlığıyla imzanızı atarsınız. Hiçbir komisyon veya son dakika kesintisi yapılmaz.</p>

<h3>4. Ücretsiz Lojistik ve Çekici Hizmeti</h3>
<p>Anlaşma sağlandığı ve noter işlemleri bittiği anda aracınızın hiçbir sorumluluğu sizde kalmaz. Aracınız ister İstanbul İkitelli Sanayi'de, ister İzmir Çeşme Otoyolu'nda, isterse de evinizin otoparkında olsun; Oto Grade'in Türkiye genelindeki geniş çekici ağı sayesinde aracınız bulunduğu noktadan <strong>tamamen ücretsiz</strong> olarak teslim alınır.</p>

<!-- HIGH CONVERSION CTA -->
<div style="margin: 64px 0; background-color: #1a1c1c; border-radius: 24px; padding: 56px 32px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
  <div style="position: absolute; inset: 0; opacity: 0.15; background: radial-gradient(circle at center, #B22300 0%, transparent 70%);"></div>
  <div style="position: relative; z-index: 10;">
    <h3 style="font-size: 32px; font-weight: bold; color: #ffffff; margin: 0 0 16px 0; line-height: 1.2;">Zamanınızı ve Paranızı<br />Boşa Harcamayın!</h3>
    <p style="color: #e5e2e1; margin: 0 auto 32px auto; max-width: 600px; font-size: 16px; line-height: 1.6;">Stresli kaza sürecini arkanızda bırakın. Oto Grade ile aracınızın güncel piyasa değerini anında öğrenin, noter güvencesiyle paranızı cebinize koyun ve hayata kaldığınız yerden devam edin.</p>
    <a href="/tr/teklif-al" style="display: inline-flex; align-items: center; justify-content: center; background-color: #B22300; color: #ffffff; padding: 16px 40px; border-radius: 9999px; font-weight: bold; font-size: 16px; text-decoration: none; box-shadow: 0 0 20px rgba(178, 35, 0, 0.5); transition: opacity 0.2s;">
      Aynı Gün Satış İçin Teklif Alın ${iconArrow}
    </a>
  </div>
</div>
`;

async function run() {
  console.log("Updating Blog 6...");
  const { error } = await supabase
    .from("hazaral_blogs")
    .update({ 
      content: blogContent,
      image_url: '/images/blog/blog6_happy_customer.png',
      excerpt: "Kazalı aracınızı satmak için haftalarca uğraşmanıza gerek yok. Oto Grade'in aynı gün noter satışı, ücretsiz çekici ve anında nakit ödeme avantajlarıyla tanışın."
    })
    .eq("slug", "oto-grade-ile-hasarli-aracinizi-ayni-gun-satmanin-avantajlari");

  if (error) {
    console.error("Failed to update blog:", error);
    process.exit(1);
  }
  
  console.log("Successfully updated Blog 6 with ultra-rich HTML!");
}

run();
