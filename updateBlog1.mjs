import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const iconCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary mt-1 shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const iconAlert = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 shrink-0 mt-1"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
const iconArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block ml-[4px]"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
const iconInfo = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary mt-1 shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
const iconPhone = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-[8px]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`;

const blogContent = `
<p class="lead text-lg mb-8">Hasarlı bir araç satmak, normal ikinci el araç satışından çok daha karmaşık ve dikkat gerektiren bir süreçtir. Aracınızın piyasa değerini (rayiç bedelini) doğru belirlemek, yasal süreçleri eksiksiz tamamlamak ve en önemlisi güvenilir bir alıcı bulmak, ileride yaşanabilecek ciddi hukuki ve maddi sorunların önüne geçer. Oto Grade olarak, yılların getirdiği sektörel tecrübeyle hasarlı araç satarken hayat kurtaracak kapsamlı bir rehber hazırladık.</p>

<div style="margin: 48px 0; text-align: center;">
  <img src="/images/blog/blog1_valuation_info.png" alt="Araç Değerleme Uzmanı Hasar Tespiti Yaparken" style="width: 100%; max-width: 800px; max-height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;" />
  <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 16px; font-style: italic;">Kurumsal ekspertiz uzmanları, hasarlı aracınızın değerini şeffaf bir şekilde belirler.</p>
</div>

<h3>Hasarlı Araç Piyasasında En Sık Yapılan Büyük Hatalar</h3>
<p>Pek çok araç sahibi, kaza sonrası yaşadığı stres, tamirhanelerdeki belirsizlikler ve otopark faturalarının getirdiği aciliyet duygusuyla yanlış kararlar verebilmektedir. Aşağıdaki kritik hatalardan kaçınmak, aracınızı satarken on binlerce lira zarar etmenizi engelleyecektir:</p>

<ul style="list-style: none; padding-left: 0; margin-top: 24px;">
  <li style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; margin-bottom: 16px;">
    ${iconAlert}
    <span><strong style="color: #1a1c1c;">Değerini Bilmeden Satmak:</strong> Aracınız <a href="/tr/hizmet/kazali-arac-alimi" style="color: #B22300; font-weight: 500; text-decoration: underline;">kazalı</a>, pert veya tamamen <a href="/tr/hizmet/hurda-arac-alimi" style="color: #B22300; font-weight: 500; text-decoration: underline;">hurda</a> olsa dahi bir "sovtaj" (kurtarılabilir yedek parça ve metal ağırlığı) değeri vardır. Aceleyle ilk gelen teklifi kabul etmek yerine profesyonel piyasa araştırması yapmalısınız.</span>
  </li>
  <li style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; margin-bottom: 16px;">
    ${iconAlert}
    <span><strong style="color: #1a1c1c;">Evrak İşlerini İhmal Etmek:</strong> Satış noterden yapılmadan aracı "aramızda bir sözleşmeyle halledelim" diyerek teslim etmek hukuki facialara yol açabilir. Çekme belgesi veya resmi noter satışı kesinlikle şarttır. Aksi takdirde aracın karıştığı her türlü yasa dışı olaydan siz sorumlu tutulursunuz.</span>
  </li>
  <li style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; margin-bottom: 16px;">
    ${iconAlert}
    <span><strong style="color: #1a1c1c;">Merdiven Altı Alıcılara Güvenmek:</strong> Başlangıçta telefonda çok yüksek fiyat verip, notere gidildiğinde "şurada da hasar varmış, motor şase yapmış" gibi bahanelerle fiyattan ciddi kesintiler yapmaya çalışan profesyonel olmayan kişilerle zaman kaybetmeyin.</span>
  </li>
</ul>

<!-- INFOGRAPHIC BLOCK -->
<div style="margin: 64px 0; background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
  <div style="background-color: #fafafa; padding: 24px; border-bottom: 1px solid #e2e2e2;">
    <h3 style="font-size: 20px; font-weight: 700; color: #1a1c1c; margin: 0; text-align: center; display: flex; align-items: center; justify-content: center; gap: 12px;">
      ${iconInfo} Oto Grade ile Satış Adımları
    </h3>
  </div>
  <div style="padding: 32px;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; text-align: center;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #B22300; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(178, 35, 0, 0.3);">1</div>
        <h4 style="font-weight: bold; font-size: 18px; color: #1a1c1c; margin: 0 0 8px 0;">Ücretsiz Teklif</h4>
        <p style="font-size: 14px; color: #666666; margin: 0; line-height: 1.6;">Aracınızın hasar fotoğraflarını sistemimize yükleyin, uzmanlarımız dakikalar içinde fiyat teklifi sunsun.</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #B22300; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(178, 35, 0, 0.3);">2</div>
        <h4 style="font-weight: bold; font-size: 18px; color: #1a1c1c; margin: 0 0 8px 0;">Yerinden Alım</h4>
        <p style="font-size: 14px; color: #666666; margin: 0; line-height: 1.6;">Teklifi onayladığınızda, kendi çekicilerimizle aracınızı Türkiye'nin neresinde olursa olsun ücretsiz teslim alalım.</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #B22300; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(178, 35, 0, 0.3);">3</div>
        <h4 style="font-weight: bold; font-size: 18px; color: #1a1c1c; margin: 0 0 8px 0;">Noter & Nakit</h4>
        <p style="font-size: 14px; color: #666666; margin: 0; line-height: 1.6;">Evrak işlemleri sizin adınıza hızla tamamlanır ve imzalar atılmadan paranız hesabınıza geçer.</p>
      </div>
    </div>
  </div>
</div>

<h3>Çekme Belgesi Süreci Neden Önemlidir?</h3>
<p>Eğer aracınız ağır hasarlıysa ve bir daha trafiğe çıkamayacak veya uzun süre sanayide kalacak durumdaysa, noter satışı öncesinde aracı trafikten çekip "Çekme Belgeli" statüsüne getirmeniz gerekmektedir.</p>

<div style="margin: 48px 0; text-align: center;">
  <img src="/images/blog/blog1_document_process.png" alt="Araç ruhsatı, çekme belgesi ve ofis masası" style="width: 100%; max-width: 800px; max-height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;" />
  <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 16px; font-style: italic;">Evrak işlemlerinin eksiksiz yapılması, gelecekteki yasal sorunları önler.</p>
</div>

<p>Bu yasal işlem, aracın vergi borcu (MTV) ve zorunlu trafik sigortası poliçesi gibi yıllık yükümlülüklerinden sizi tamamen kurtarır. İleride onarılması halinde araç tekrar muayeneye sokularak trafiğe dönebilir. İşlemin nasıl yapılacağı hakkında detaylı bilgiyi <a href="/tr/hizmet/cekme-belgeli-arac-alimi" style="color: #B22300; font-weight: 500; text-decoration: underline;">Çekme Belgeli Araç Alımı</a> sayfamızda bulabilirsiniz.</p>

<!-- HIGH CONVERSION CTA -->
<div style="margin: 64px 0; background-color: #1a1c1c; border-radius: 24px; padding: 56px 32px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
  <div style="position: absolute; inset: 0; opacity: 0.15; background: radial-gradient(circle at center, #B22300 0%, transparent 70%);"></div>
  <div style="position: relative; z-index: 10;">
    <h3 style="font-size: 32px; font-weight: bold; color: #ffffff; margin: 0 0 16px 0; line-height: 1.2;">Aracınızın Gerçek Değerini <br />Merak Mı Ediyorsunuz?</h3>
    <p style="color: #e5e2e1; margin: 0 auto 32px auto; max-width: 600px; font-size: 16px; line-height: 1.6;">Hasarlı aracınızı yok pahasına satmayın. Oto Grade'in kurumsal fiyatlandırma altyapısıyla anında tanışın. Değerleme tamamen ücretsiz ve bağlayıcı değildir.</p>
    <a href="/tr/teklif-al" style="display: inline-flex; align-items: center; justify-content: center; background-color: #B22300; color: #ffffff; padding: 16px 40px; border-radius: 9999px; font-weight: bold; font-size: 16px; text-decoration: none; box-shadow: 0 0 20px rgba(178, 35, 0, 0.5); transition: opacity 0.2s;">
      Hemen Ücretsiz Fiyat Teklifi Alın ${iconArrow}
    </a>
  </div>
</div>

<h3>Başarılı Bir Satış İçin Altın Kurallar</h3>
<p>Aracınızı sorunsuz, hızlı ve değerinde satmak istiyorsanız şu profesyonel adımları izlemelisiniz:</p>
<ul style="list-style: none; padding-left: 0; margin-top: 24px;">
  <li style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px;">
    ${iconCheck}
    <span><strong style="color: #1a1c1c;">Kapsamlı Fotoğraf Çekin:</strong> Aracın her açısından (ön, arka, yanlar, tavan ve motor içi) net fotoğraflar alın. Şeffaflık her zaman güven yaratır ve doğru fiyatlandırma yapılmasını sağlar. Hasarı gizlemeye çalışmak ekspertiz aşamasında her zaman ortaya çıkar.</span>
  </li>
  <li style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px;">
    ${iconCheck}
    <span><strong style="color: #1a1c1c;">Evrakları Eksiksiz Hazırlayın:</strong> Ruhsat, varsa eksper raporu, hasar kaydı (Tramer) dökümü ve güncel "borcu yoktur" (vergi dairesi/e-devlet) kağıdını elinizin altında bulundurun.</span>
  </li>
  <li style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px;">
    ${iconCheck}
    <span><strong style="color: #1a1c1c;">Kurumsal Alıcı Tercih Edin:</strong> Bireysel alıcılar kredi bulmakta zorlanabilir veya satışı uzatabilir. Kurumsal firmalar bürokratik süreci sizin adınıza yönetir, noter masraflarını karşılar ve nakit ödeme garantisi sunar.</span>
  </li>
</ul>

<h3>Sonuç: Neden Oto Grade'i Seçmelisiniz?</h3>
<p>Oto Grade, hasarlı veya pert aracınızı satarken sizi tüm bu yorucu prosedürlerden ve belirsizliklerden tamamen kurtarır. Geniş operasyon ağımız sayesinde, aracınızın bulunduğu konuma <strong>Türkiye'nin her yerinden ücretsiz çekici</strong> gönderiyoruz. Şeffaf ekspertiz sürecimiz sonrasında anlaşılan tutar, noterde imzalar atılmadan saniyeler önce kurumsal banka hesabımızdan doğrudan sizin adınıza kayıtlı IBAN numarasına transfer edilir.</p>
<p>Kaza sonrası sürecin stresini ve yükünü bize bırakın, profesyonel hizmetin rahatlığını yaşayın. Firmamız ve güvencelerimiz hakkında daha fazla bilgi edinmek için <a href="/tr/hakkimizda" style="color: #B22300; font-weight: 500; text-decoration: underline;">Hakkımızda</a> sayfasını inceleyebilir, ya da piyasadaki diğer hasarlı araçları görmek için <a href="/tr/satilik-araclar" style="color: #B22300; font-weight: 500; text-decoration: underline;">Oto Grade Pazaryeri'ne</a> göz atabilirsiniz.</p>
`;

async function run() {
  const { error } = await supabase
    .from('hazaral_blogs')
    .update({ content: blogContent })
    .eq('slug', 'hasarli-arac-satarken-dikkat-edilmesi-gerekenler');
    
  if (error) {
    console.error(`Failed to update blog:`, error.message);
  } else {
    console.log(`Successfully updated Blog 1 with ultra-rich HTML!`);
  }
}

run();
