import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const iconMap = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const iconCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const iconArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
const iconAlert = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B22300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-1"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

const blogContent = `
<p class="lead text-lg mb-8">Türkiye'nin yoğun nüfuslu metropolleri olan İstanbul, Ankara, İzmir ve Antalya'da trafik yoğunluğu, kaza oranlarının da yüksek olmasına neden olmaktadır. Büyükşehirlerde kaza yaptıktan sonra aracın sanayiye çekilmesi, tamir veya pert süreçlerinin yürütülmesi ciddi bir lojistik ve zaman maliyeti doğurur. Oto Grade olarak, büyükşehirlerdeki <strong>kazalı ve hasarlı araç sahiplerine</strong> sunduğumuz özel çözümleri ve bu süreçte nelere dikkat etmeniz gerektiğini anlatıyoruz.</p>

<div style="margin: 48px 0; text-align: center;">
  <img src="/images/blog/blog4_city_logistics.png" alt="Oto Grade Büyükşehir Çekici Ağı" style="width: 100%; max-width: 800px; max-height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;" />
  <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 16px; font-style: italic;">Oto Grade'in geniş filosu, metropol trafiğinde aracınızı güvenle ve hızla bulunduğunuz noktadan teslim alır.</p>
</div>

<h3>Büyükşehirlerde Kaza Sonrası Yaşanan En Büyük Krizler</h3>
<p>Büyükşehirlerdeki sanayi siteleri genellikle şehir dışında veya ulaşımı zor bölgelerdedir. Aracınız ağır hasar aldığında onu bir otoparkta bekletmek, her geçen gün size astronomik <strong>otopark ücretleri</strong> olarak geri döner. Üstelik şehir içi çekici maliyetleri de oldukça yüksektir.</p>

<ul style="list-style: none; padding-left: 0; margin-top: 24px;">
  <li style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; margin-bottom: 16px;">
    ${iconAlert}
    <span><strong style="color: #B22300;">Otopark ve Çekici Tuzağı:</strong> Kazadan sonra aracınız özel bir yedi-emin otoparkına çekildiyse, sigorta veya satış süreçlerini beklerken binlerce liralık faturalarla karşılaşabilirsiniz. Bu süreci günlerce uzatmak yerine aracınızı hızlıca nakde çevirmek en rasyonel çözümdür.</span>
  </li>
</ul>

<!-- INFOGRAPHIC BLOCK: Şehir Şehir Çözümler -->
<div style="margin: 64px 0; background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
  <div style="background-color: #f8fafc; padding: 24px; border-bottom: 1px solid #e2e2e2;">
    <h3 style="font-size: 20px; font-weight: 700; color: #1a1c1c; margin: 0; text-align: center; display: flex; align-items: center; justify-content: center; gap: 12px;">
      ${iconMap} Türkiye'nin Dört Bir Yanında Operasyon Ağı
    </h3>
  </div>
  <div style="padding: 32px;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
      
      <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background-color: #ffffff;">
        <h4 style="font-weight: bold; font-size: 16px; color: #1a1c1c; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: #3b82f6;"></span> İstanbul & Ankara
        </h4>
        <p style="font-size: 14px; color: #666666; margin: 0; line-height: 1.5;">Geniş çekici ağımızla, İkitelli'den Şaşmaz'a, aracınız hangi sanayide veya otoparkta olursa olsun aynı gün içinde yerinden teslim alıyoruz.</p>
      </div>

      <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background-color: #ffffff;">
        <h4 style="font-weight: bold; font-size: 16px; color: #1a1c1c; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: #10b981;"></span> İzmir & Ege Bölgesi
        </h4>
        <p style="font-size: 14px; color: #666666; margin: 0; line-height: 1.5;">Özellikle yazlık bölgelerde ve otoyollarda gerçekleşen kazalar sonrası, yüksek lojistik maliyetlerini tamamen biz karşılıyoruz.</p>
      </div>

      <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background-color: #ffffff;">
        <h4 style="font-weight: bold; font-size: 16px; color: #1a1c1c; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: #f59e0b;"></span> Antalya & Akdeniz
        </h4>
        <p style="font-size: 14px; color: #666666; margin: 0; line-height: 1.5;">Turizm bölgelerindeki kaza oranlarına karşı Antalya operasyon merkezimiz, aracınızın değerini aynı gün içinde hesaplar ve anında nakde çevirir.</p>
      </div>

    </div>
  </div>
</div>

<h3>81 İlde Kurumsal Filo ve Sınıfının En İyi Fiyatları</h3>
<p>Aracınızın bulunduğu şehir neresi olursa olsun, Oto Grade'in fiyatlama politikası ulusal standartlardadır. Yani aracınızın marka, model ve hasar durumuna göre belirlenen <strong>sovtaj değeri</strong>, bulunduğunuz şehrin sanayi esnafının insafına bırakılmaz. Türkiye'nin her yerinde geçerli, en optimize edilmiş ve rekabetçi fiyat teklifini alırsınız.</p>

<div style="margin: 48px 0; text-align: center;">
  <img src="/images/blog/blog4_fleet.png" alt="Oto Grade Kurumsal Kurtarıcı Filosu" style="width: 100%; max-width: 800px; max-height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;" />
  <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 16px; font-style: italic;">Güçlü lojistik altyapımızla aracı yerinden alır, sizi hiçbir ek masrafa sokmayız.</p>
</div>

<ul style="list-style: none; padding-left: 0; margin-top: 24px;">
  <li style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px;">
    ${iconCheck}
    <span><strong>Teklifte Netlik:</strong> Şehirler arası fiyat farkı gözetmeksizin piyasa değerinde gerçekçi teklif.</span>
  </li>
  <li style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px;">
    ${iconCheck}
    <span><strong>Yerinde Teslimat:</strong> Oto Grade ekipleri noter satışından hemen sonra aracınızı bulunduğu adresten veya otoparktan çeker.</span>
  </li>
  <li style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px;">
    ${iconCheck}
    <span><strong>Masrafsız Süreç:</strong> Çekici ücreti, otopark borcu süreç yönetimi tamamen bizim sorumluluğumuzdadır.</span>
  </li>
</ul>

<!-- HIGH CONVERSION CTA -->
<div style="margin: 64px 0; background-color: #1a1c1c; border-radius: 24px; padding: 56px 32px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
  <div style="position: absolute; inset: 0; opacity: 0.15; background: radial-gradient(circle at center, #B22300 0%, transparent 70%);"></div>
  <div style="position: relative; z-index: 10;">
    <h3 style="font-size: 32px; font-weight: bold; color: #ffffff; margin: 0 0 16px 0; line-height: 1.2;">Türkiye'nin Neresinde Olursanız Olun,<br />Aracınızı Anında Nakde Çevirin</h3>
    <p style="color: #e5e2e1; margin: 0 auto 32px auto; max-width: 600px; font-size: 16px; line-height: 1.6;">Otopark ve çekici masraflarıyla uğraşmayın. Aracınızın fotoğraflarını sistemimize yükleyin, Türkiye'nin neresinde olursanız olun aynı gün içinde en iyi teklifi alıp satış işlemini tamamlayalım.</p>
    <a href="/tr/teklif-al" style="display: inline-flex; align-items: center; justify-content: center; background-color: #B22300; color: #ffffff; padding: 16px 40px; border-radius: 9999px; font-weight: bold; font-size: 16px; text-decoration: none; box-shadow: 0 0 20px rgba(178, 35, 0, 0.5); transition: opacity 0.2s;">
      Hemen Ücretsiz Fiyat Teklifi Alın ${iconArrow}
    </a>
  </div>
</div>
`;

async function run() {
  console.log("Updating Blog 4...");
  const { error } = await supabase
    .from("hazaral_blogs")
    .update({ 
      content: blogContent,
      image_url: '/images/blog/blog4_city_logistics.png',
      excerpt: "Büyükşehirlerde kaza sonrası aracın otopark ve çekici masraflarından nasıl kurtulursunuz? İstanbul, Ankara, İzmir ve Antalya için Oto Grade ile masrafsız hasarlı araç satış rehberi."
    })
    .eq("slug", "buyuksehirlerde-hasarli-arac-satisi");

  if (error) {
    console.error("Failed to update blog:", error);
    process.exit(1);
  }
  
  console.log("Successfully updated Blog 4 with ultra-rich HTML!");
}

run();
