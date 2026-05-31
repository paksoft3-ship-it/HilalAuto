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
<p class="lead text-lg mb-8">Kullanılmaz hale gelen, ağır kazaya karışan veya sigorta şirketleri tarafından "pert" (tam hasarlı) kabul edilen araçlarınızı satmak, kafa karıştırıcı ve zorlu bir süreç gibi görünebilir. Özellikle <strong>hurda araç alan yerler</strong> arasında güvenilir ve kurumsal bir muhatap bulmak, aracınızın gerçek "sovtaj" (hurda/yedek parça) değerini alabilmeniz için kritik bir öneme sahiptir. Oto Grade olarak, hurda ve pert araç satış sürecini tüm detaylarıyla ele alıyoruz.</p>

<div style="margin: 48px 0; text-align: center;">
  <img src="/images/blog/blog2_salvage_yard.png" alt="Oto Grade Hurda ve Pert Araç Değerleme Merkezi" style="width: 100%; max-width: 800px; max-height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;" />
  <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 16px; font-style: italic;">Kurumsal değerleme uzmanlarımız, hurda ve pert araçlarınızın yedek parça ve geri dönüşüm potansiyelini inceler.</p>
</div>

<h3>Hurda ve Pert Araç Arasındaki Temel Farklar Nelerdir?</h3>
<p>Bu iki kavram genellikle aynı anlamda kullanılsa da hukuki ve ticari olarak farklılıklar taşır. Aracınızın durumunu doğru bilmek, alacağınız teklifleri de doğrudan etkiler.</p>

<ul style="list-style: none; padding-left: 0; margin-top: 24px;">
  <li style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px;">
    ${iconInfo}
    <span><strong style="color: #1a1c1c;">Pert Araç (Ağır Hasarlı):</strong> Sigorta şirketi tarafından onarım masrafı aracın rayiç bedeline yaklaştığı (genellikle %70 ve üzeri) için onarılması ekonomik bulunmayan araçlardır. Bu araçlar uygun şekilde onarıldığında TSE belgeli ekspertiz ve muayene sonrasında <strong>tekrar trafiğe çıkabilir.</strong> Bu sebeple değerleri sadece metal hurdası değil, aynı zamanda onarım potansiyeli taşıdıkları için daha yüksektir.</span>
  </li>
  <li style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px;">
    ${iconInfo}
    <span><strong style="color: #1a1c1c;">Hurda Araç (Çekme Belgeli - Trafikten Men):</strong> Yangın, sel, çok ağır fiziki çarpışma gibi sebeplerle şasisi tamamen kopmuş, motoru parçalanmış ve onarılması teknik olarak imkansız veya yasa dışı olan araçlardır. Bu araçlar <strong>kesinlikle tekrar trafiğe çıkamaz.</strong> Sadece yedek parça ve metal geri dönüşümü (sovtaj) amacıyla değerlendirilir.</span>
  </li>
</ul>

<h3>Hurda Araç Satarken En Sık Yapılan Kritik Hatalar</h3>
<p>Aracınızın pert veya hurda durumuna gelmesi yeterince stresliyken, bir de satış sürecinde dolandırıcılık veya hukuki sorunlarla karşılaşmamak için aşağıdaki hatalardan mutlaka kaçının:</p>
<ul style="list-style: none; padding-left: 0; margin-top: 24px;">
  <li style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px;">
    ${iconAlert}
    <span><strong style="color: #1a1c1c;">"Araç Zaten Hurda, Evrağa Gerek Yok" Yanılgısı:</strong> Kesinlikle yanlış! Aracınızın sadece kaportası ve motoru parçalanmış olabilir, ancak <strong>ruhsatınız ve şasi numaranız hala resmi kayıtlarda size aittir.</strong> Aracı sadece "aramızda hallederiz" diyerek gayriresmi yollarla satarsanız, o şasi numarasıyla işlenecek herhangi bir yasadışı işlemden (örn: ikiz plaka, change araç) doğrudan siz sorumlu tutulursunuz.</span>
  </li>
  <li style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px;">
    ${iconAlert}
    <span><strong style="color: #1a1c1c;">Parça Parça Satmaya Çalışmak:</strong> Aracın motorunu birine, farını diğerine satmak ilk başta karlı gibi görünse de; elde kalan devasa bir araç iskeletini yasal yollardan bertaraf etmek, vergi ve sigorta yükümlülüklerini düşürmek imkansız hale gelebilir. Parçalanmış bir aracı trafikten çekmek çok daha zordur.</span>
  </li>
</ul>

<!-- INFOGRAPHIC BLOCK -->
<div style="margin: 64px 0; background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
  <div style="background-color: #fafafa; padding: 24px; border-bottom: 1px solid #e2e2e2;">
    <h3 style="font-size: 20px; font-weight: 700; color: #1a1c1c; margin: 0; text-align: center; display: flex; align-items: center; justify-content: center; gap: 12px;">
      ${iconCheck} Oto Grade Güvencesiyle Pert/Hurda Satış Ayrıcalıkları
    </h3>
  </div>
  <div style="padding: 32px;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; text-align: center;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #25D366; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(37, 211, 102, 0.3);">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h4 style="font-weight: bold; font-size: 18px; color: #1a1c1c; margin: 0 0 8px 0;">Anında Nakit Ödeme</h4>
        <p style="font-size: 14px; color: #666666; margin: 0; line-height: 1.6;">Anlaşılan tutar, noter aşamasında ıslak imza atılmadan önce EFT/Havale yoluyla doğrudan hesabınıza geçer.</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #B22300; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(178, 35, 0, 0.3);">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
        </div>
        <h4 style="font-weight: bold; font-size: 18px; color: #1a1c1c; margin: 0 0 8px 0;">Ücretsiz Çekici</h4>
        <p style="font-size: 14px; color: #666666; margin: 0; line-height: 1.6;">Aracınız Türkiye'nin neresinde olursa olsun, özel çekicilerimiz aracı kapınızdan bedelsiz olarak alır.</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #1a1c1c; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>
        </div>
        <h4 style="font-weight: bold; font-size: 18px; color: #1a1c1c; margin: 0 0 8px 0;">Sıfır Hukuki Risk</h4>
        <p style="font-size: 14px; color: #666666; margin: 0; line-height: 1.6;">Ruhsat devri ve çekme belgesi işlemleri resmi yollarla yapılır, tüm hukuki bağınız tamamen koparılır.</p>
      </div>
    </div>
  </div>
</div>

<h3>Çekici (Kurtarıcı) Ağı ve Ücretsiz Teslimat</h3>
<p>Pert ve hurda araçların en büyük problemlerinden biri lojistiktir. Çoğu araç tekerlekleri dönmeyecek veya motoru çalışmayacak durumdadır. Sanayi sitelerinde, otoparklarda veya kaza mahallinde bekleyen aracınız için her geçen gün otopark ücreti yazmaktadır.</p>

<div style="margin: 48px 0; text-align: center;">
  <img src="/images/blog/blog2_tow_truck.png" alt="Oto Grade Ücretsiz Çekici Hizmeti" style="width: 100%; max-width: 800px; max-height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;" />
  <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 16px; font-style: italic;">Oto Grade, geniş filosuyla aracınızı güvenle teslim alır. Çekici ücreti tarafımızca karşılanır.</p>
</div>

<p>Piyasada "hurda araç alan yerler" genellikle çekici masrafını satıcıya yansıtır veya anlaşılan fiyattan düşmeye çalışır. <strong>Oto Grade olarak en büyük farkımız;</strong> Türkiye'nin 81 ilini kapsayan lojistik ağımız sayesinde çekici ücretlerini tamamen bizim karşılamamızdır. Otoparkta birikmiş ücretleriniz varsa, bu işlemlerin kapatılmasında da hukuki destek sağlıyoruz.</p>

<!-- HIGH CONVERSION CTA -->
<div style="margin: 64px 0; background-color: #1a1c1c; border-radius: 24px; padding: 56px 32px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
  <div style="position: absolute; inset: 0; opacity: 0.15; background: radial-gradient(circle at center, #B22300 0%, transparent 70%);"></div>
  <div style="position: relative; z-index: 10;">
    <h3 style="font-size: 32px; font-weight: bold; color: #ffffff; margin: 0 0 16px 0; line-height: 1.2;">Hurda Aracınız İçin En İyi<br />Fiyatı mı Arıyorsunuz?</h3>
    <p style="color: #e5e2e1; margin: 0 auto 32px auto; max-width: 600px; font-size: 16px; line-height: 1.6;">Çekici masrafı ödemeden, noter güvencesiyle aynı gün içinde aracınızı nakde çevirin. Oto Grade uzmanları aracınızın geri dönüşüm potansiyelini ücretsiz hesaplasın.</p>
    <a href="/tr/teklif-al" style="display: inline-flex; align-items: center; justify-content: center; background-color: #B22300; color: #ffffff; padding: 16px 40px; border-radius: 9999px; font-weight: bold; font-size: 16px; text-decoration: none; box-shadow: 0 0 20px rgba(178, 35, 0, 0.5); transition: opacity 0.2s;">
      Ücretsiz Teklif İste ${iconArrow}
    </a>
  </div>
</div>

<h3>Sonuç: Merdiven Altına Değil, Kurumsala Güvenin</h3>
<p>Hurda ve pert araç satışında yapılan en büyük hata, güvenilir olmayan kişilere aracı teslim etmektir. Birkaç bin lira daha yüksek teklif almak uğruna, aracın usulsüz işlemler için kullanılması sonucu kendinizi yıllar süren ağır ceza mahkemelerinde bulabilirsiniz.</p>
<p>Oto Grade, <a href="/tr/hakkimizda" style="color: #B22300; font-weight: 500; text-decoration: underline;">kurumsal yapısı</a> ve alanında uzman değerleme ekibiyle aracınızı yasal standartlarda, noter huzurunda "Çekme Belgeli" veya "Hurda Belgeli" olarak devralır. Aklınızda soru işareti kalmaması için süreçlerimizi şeffaflıkla yürütüyoruz.</p>
`;

async function run() {
  console.log("Updating Blog 2...");
  const { error } = await supabase
    .from("hazaral_blogs")
    .update({ 
      content: blogContent,
      image_url: '/images/blog/blog2_salvage_yard.png',
      excerpt: "Kullanılmaz hale gelen, ağır kazaya karışan veya pert kabul edilen araçlarınızı en yüksek sovtaj değeriyle satmanın püf noktaları. Kurumsal hurda araç alan yerler rehberi."
    })
    .eq("slug", "hurda-ve-pert-arac-satisi-rehberi");

  if (error) {
    console.error("Failed to update blog:", error);
    process.exit(1);
  }
  
  console.log("Successfully updated Blog 2 with ultra-rich HTML!");
}

run();
