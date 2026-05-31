import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const richBlogs = {
  "hasarli-arac-satarken-dikkat-edilmesi-gerekenler": `
<p>Hasarlı bir araç satmak, normal ikinci el araç satışından çok daha karmaşık ve dikkat gerektiren bir süreçtir. Aracınızın değerini doğru belirlemek, yasal süreçleri eksiksiz tamamlamak ve güvenilir bir alıcı bulmak büyük önem taşır. İşte hasarlı araç satarken hayat kurtaracak rehberimiz!</p>

<h3>⚠️ En Sık Yapılan 3 Büyük Hata</h3>
<ul>
  <li><strong>Değerini Bilmeden Satmak:</strong> Aracınız hasarlı olsa bile bir "sovtaj" (hurda/kurtarılabilir parça) değeri vardır. İlk teklifi hemen kabul etmeyin.</li>
  <li><strong>Evrak İşlerini İhmal Etmek:</strong> Satış noterden yapılmadan aracı teslim etmek hukuki facialara yol açabilir. Çekme belgesi veya noter satışı şarttır.</li>
  <li><strong>Merdiven Altı Alıcılar:</strong> Nakit vereceğini söyleyip son anda fiyattan kırmaya çalışan profesyonel olmayan kişilerle zaman kaybetmek.</li>
</ul>

<h3>✅ Başarılı Satış İçin 5 Altın Kural</h3>
<p>Aracınızı sorunsuz satmak için şu adımları izleyin:</p>
<ol>
  <li><strong>📸 Kapsamlı Fotoğraf Çekin:</strong> Aracın her açısından, hasarlı bölgeleri gizlemeden net fotoğraflar alın. Şeffaflık güven yaratır.</li>
  <li><strong>📝 Evrakları Hazırlayın:</strong> Ruhsat, hasar kaydı raporu (varsa eksper raporu) ve borcu yoktur kağıdı elinizin altında olsun.</li>
  <li><strong>⚖️ Çekme Belgesini Araştırın:</strong> Eğer araç ağır hasarlıysa ve trafiğe çıkamayacak durumdaysa, aracı trafikten çekip "Çekme Belgeli" satmanız gerekir.</li>
  <li><strong>💰 Piyasayı Araştırın:</strong> Yedek parça piyasasını ve aynı marka/modelin sağlam piyasa değerini göz önünde bulundurarak beklentinizi belirleyin.</li>
  <li><strong>🤝 Kurumsal Alıcı Tercih Edin:</strong> Oto Grade gibi kurumsal firmalar bürokratik süreci yönetir ve anında nakit ödeme yapar.</li>
</ol>

<h3>💡 Neden Oto Grade?</h3>
<p>Oto Grade, hasarlı aracınızı satarken sizi tüm bu yorucu süreçlerden kurtarır. <strong>Anında online teklif, Türkiye'nin her yerinden ücretsiz çekici hizmeti ve noterde güvenli nakit ödeme</strong> ile aracınızı aynı gün satabilirsiniz. Belirsizlikle uğraşmayın, profesyonel hizmetin rahatlığını yaşayın!</p>
  `,
  
  "hurda-ve-pert-arac-satisi-rehberi": `
<p>Bir trafik kazası veya doğal afet sonrası aracınız "pert" (tam hasarlı) veya "hurda" durumuna düşebilir. Bu aşamada aracınızı nasıl değerlendireceğiniz, maddi kaybınızı minimize etmenin en önemli yoludur.</p>

<h3>🚗 Pert (Ağır Hasarlı) ile Hurda Arasındaki Fark Nedir?</h3>
<p>Sürece başlamadan önce terimleri doğru anlamak gerekir:</p>
<ul>
  <li><strong>Pert (Ağır Hasarlı) Araç:</strong> Onarım masrafları aracın piyasa değerinin %70'ini aşan araçlardır. Sigorta şirketi aracı "tam hasarlı" kabul eder, ancak bu araçlar onarılıp muayeneden geçtikten sonra tekrar trafiğe çıkabilir.</li>
  <li><strong>Hurda Araç:</strong> Kesinlikle onarılamayacak, şasi bütünlüğü kaybolmuş ve trafikten sonsuza dek men edilmiş araçlardır. Sadece yedek parça ve metal hurdası olarak değeri vardır.</li>
</ul>

<h3>📋 Satış Öncesi Gereken Kritik Belgeler</h3>
<p>Bu araçları satarken normal ruhsat devri yapılamaz. Duruma göre şu belgelerden biri gerekir:</p>
<ul>
  <li><strong>Çekme Belgesi:</strong> Aracın trafikten çekildiğini, vergi borcu işlemediğini ancak ileride onarılıp trafiğe dönebileceğini gösterir.</li>
  <li><strong>Hurda Belgesi:</strong> Aracın tamamen hurdaya ayrıldığını ve bir daha asla trafiğe çıkamayacağını kanıtlar. Bu belge olmadan hurda satışı yapmak yasa dışıdır.</li>
</ul>

<h3>⚖️ Sigorta Şirketinin Teklifini Kabul Etmeli misiniz?</h3>
<p>Sigorta şirketi aracınız pert olduğunda size rayiç bedel ödemesi yapar ve aracı kendisi alır. Ancak aracı sizde bırakıp (sovtaj bedelini düşerek) kısmi ödeme yapmasını da talep edebilirsiniz. <strong>İşte altın kural:</strong> Sigortanın size sunduğu sovtaj kesintisini öğrenin ve ardından piyasadan teklif alın. Eğer Oto Grade gibi bir firma sigortanın kestiği rakamdan daha fazlasını veriyorsa, aracı siz satmalısınız!</p>

<h3>🏆 Hurda ve Pert Satışında Oto Grade Farkı</h3>
<ul>
  <li>✅ Çekme ve hurda belgesi işlemlerinde profesyonel danışmanlık.</li>
  <li>✅ Çalışmayan, yürümeyen araçlar için ücretsiz kurtarıcı desteği.</li>
  <li>✅ Değerinde fiyatlandırma ve aynı gün içinde peşin ödeme.</li>
</ul>
  `,

  "buyuksehirlerde-hasarli-arac-satisi": `
<p>İstanbul, Ankara, İzmir veya Antalya gibi büyükşehirlerde yaşıyorsanız ve hasarlı bir aracınız varsa, satış süreci hem avantajlı hem de zorlu olabilir. Şehrin büyüklüğü lojistik zorluklar getirirken, Oto Grade gibi geniş ağa sahip firmalar bu süreci sizin için kolaylaştırır.</p>

<h3>🏙️ Büyükşehirlerde Satışın Lojistik Zorlukları</h3>
<p>Aracınız kaza yaptı ve sanayide veya bir yediemin otoparkında duruyor. Büyükşehirlerde şu sorunlarla karşılaşırsınız:</p>
<ul>
  <li><strong>⏱️ Yüksek Otopark Ücretleri:</strong> İstanbul ve Ankara gibi şehirlerde yediemin otoparklarının günlük ücretleri çok yüksektir. Karar sürecini uzatmak size sürekli para kaybettirir.</li>
  <li><strong>🚛 Çekici Maliyetleri:</strong> Aracı alıcıya göstermek veya başka bir tamirhaneye taşımak için çağıracağınız çekicilerin fiyatı mesafelere bağlı olarak astronomik rakamlara ulaşabilir.</li>
  <li><strong>🚥 Trafik ve Zaman Kaybı:</strong> Potansiyel alıcılarla buluşmak, pazarlık yapmak ve noter işlemlerini halletmek büyükşehir trafiğinde tam gününüzü alır.</li>
</ul>

<h3>🌟 Oto Grade Büyükşehir Çözümleri</h3>
<p>Oto Grade, geniş operasyon ağı ile bu coğrafi dezavantajları ortadan kaldırır:</p>

<h4>📍 Ankara, İstanbul ve İzmir İçin Özel Hizmet</h4>
<p>Bu şehirlerdeyseniz, Oto Grade uzmanları aracınızın bulunduğu konuma hızla ulaşır. Aracınız otoparkta rehin kalmaz, günlük ücretlerden anında kurtulursunuz.</p>

<h4>📍 Antalya ve Kıyı Şeritleri</h4>
<p>Özellikle sel hasarı veya yazın yaşanan yüksek otoyol kazaları sonrası Antalya bölgesinde çekici bulmak zorlaşabilir. Oto Grade'in kendi çekici filosu ile deniz kenarından dağa kadar her noktadan aracınız teslim alınır.</p>

<h3>✅ Neden Bizi Seçmelisiniz?</h3>
<p>Siz evinizden çıkmadan, sadece web sitemiz üzerinden fotoğrafları göndererek teklif alırsınız. Anlaşma sağlandığında ekibimiz aracı bulunduğu yerden alır, noter işlemini size en yakın veya sizin için en kolay noktada gerçekleştirir. Büyükşehir karmaşasını bize bırakın!</p>
  `,

  "2026-hasarli-arac-satarken-5-ipucu": `
<p>Otomotiv sektörü hızla değişiyor. 2026 yılına geldiğimizde, araç fiyatlarındaki dalgalanmalar, artan yedek parça maliyetleri ve dijitalleşme, hasarlı araç satış dinamiklerini tamamen değiştirdi. İşte bu yeni dönemde zarar etmemeniz için bilmeniz gereken 5 hayati ipucu.</p>

<h3>1. 📈 Yedek Parça Maliyetlerini Göz Önünde Bulundurun</h3>
<p>2026 yılında döviz kurları ve global lojistik maliyetleri nedeniyle yedek parça fiyatları ciddi oranda arttı. Bu durum, aracınızı tamir ettirmenin eskisinden çok daha pahalı olmasına neden oluyor. Çoğu durumda, "tamir ettirip sağlam satmak" yerine "hasarlı haliyle satmak" daha kârlı bir matematik sunuyor. Karar vermeden önce mutlaka detaylı bir onarım maliyeti tablosu çıkarın.</p>

<h3>2. 📱 Dijital Ekspertizi Avantaja Çevirin</h3>
<p>Artık alıcıların gelip araca fiziksel olarak bakması gerekmiyor. Oto Grade gibi kurumsal firmalar, yüksek çözünürlüklü fotoğraflar ve videolar üzerinden yapay zeka destekli hasar tespitleri yapabiliyor. Aracınızı bulunduğu yerden hareket ettirmeden dijital kanallar üzerinden anında fiyatlandırılmasını talep edin.</p>

<h3>3. ⚡ Hızlı Karar Verin, Beklemeyin</h3>
<p>Enflasyonist ortamlarda beklemek para kaybettirir. Özellikle elektronik aksamı ağır hasar görmüş araçlar veya su almış (sel hasarlı) araçlar, bekledikçe paslanma ve korozyon nedeniyle değer kaybeder. Hızlı hareket ederek aracınızı bir an önce nakde çevirmek 2026'nın en iyi stratejisidir.</p>

<h3>4. ⚖️ Resmi Prosedürleri Atlamayın</h3>
<p>Yasal düzenlemeler giderek sıkılaşıyor. 2026 yılında, noter satışı veya çekme belgesi devri yapılmadan araç teslim etmek devasa idari para cezalarına yol açabilir. "Sözleşmeyle hallederiz" diyen geleneksel al-satçılardan uzak durun. Tüm işlemleri Noterlik Sistemi üzerinden resmi olarak gerçekleştirin.</p>

<h3>5. 🤝 Güvenilir ve Kurumsal Partnerler Seçin</h3>
<p>Bireysel alıcıların finansman bulmakta zorlandığı bu dönemde, peşin ödeme gücüne sahip kurumsal firmalarla çalışmak esastır. Oto Grade, güçlü sermayesi ve kurumsal altyapısı ile anlaşılan rakamı noterde imza atılmadan hemen önce banka hesabınıza kuruşu kuruşuna transfer eder.</p>
  `,

  "araciniz-kaza-sonrasi-pert-oldugunda-ne-yapmalisiniz": `
<p>Büyük bir trafik kazası geçirmek herkes için sarsıcı bir deneyimdir. Fiziksel olarak yara almamış olsanız bile, sonrasında aracınızın durumuyla ilgili atmanız gereken hukuki ve teknik adımlar kafa karıştırıcı olabilir. Aracınızın hasar boyutu rayiç bedelinin %70'ine veya daha fazlasına ulaştığında "Pert (Tam Hasarlı)" kararı verilir. Peki bu noktadan sonra ne yapmalısınız?</p>

<h3>⏱️ 1. Kaza Anı ve İlk Tespitler</h3>
<p>Kazanın hemen ardından güvenlik tedbirlerini alın ve gerekli polis/jandarma ekiplerini çağırarak resmi tutanak tutulmasını sağlayın. Araç kaskoluysa, <strong>5 iş günü</strong> içinde durumu sigorta şirketinize bildirmekle yükümlüsünüz. Eksper atanacak ve aracınızın onarım maliyeti hesaplanacaktır.</p>

<h3>⚖️ 2. Pert (Tam Hasarlı) Kararının Çıkması</h3>
<p>Eksper incelemesi sonucunda aracın onarım masraflarının ekonomik olmadığına kanaat getirilirse araç "pert" sayılır. Bu aşamada sigorta şirketi size iki seçenek sunar:</p>
<ul>
  <li><strong>Aracı Sigorta Şirketine Bırakmak:</strong> Sigorta şirketi size piyasa rayiç bedelini öder ve aracın mülkiyetini alır.</li>
  <li><strong>Aracı Geri Almak:</strong> Sigorta şirketi sovtaj (hurda) bedelini düşerek size bir ödeme yapar ve hasarlı aracı size bırakır.</li>
</ul>

<h3>💰 3. Hangi Seçenek Daha Avantajlı?</h3>
<p>Çoğu zaman sigorta şirketlerinin teklif ettiği sovtaj bedeli kesintisi, aracın serbest piyasadaki gerçek hurda değerinden daha yüksektir. Yani aracı kendiniz tutup Oto Grade gibi profesyonel kurumlara sattığınızda, sigortadan alacağınız paradan daha fazlasını elde edebilirsiniz. <em>Mutlaka sigortanın teklifini kabul etmeden önce piyasadan teklif alın.</em></p>

<h3>📝 4. Aracı Kendiniz Satmaya Karar Verdiyseniz</h3>
<p>Aracınızı kendiniz satmaya karar verdiyseniz, bürokrasiyle boğuşmak zorunda değilsiniz. Çekme belgeli satış veya hurda belgeli satış işlemlerinin nasıl yapılacağını öğrenmeniz gerekir. <strong>Oto Grade</strong>, pert araçlarınızı en yüksek fiyat garantisiyle satın alır. Sadece fotoğrafları göndererek dakikalar içinde fiyat teklifi alabilirsiniz.</p>

<h3>🚀 5. Oto Grade'in Sunduğu Kolaylıklar</h3>
<p>Pert araç satışında en büyük sorun lojistik ve resmi işlemlerdir. Oto Grade; aracınızı bulunduğu otoparktan ücretsiz çeker, tüm noter masraflarını karşılar ve ödemenizi aynı gün içinde banka hesabınıza yapar. Bu sayede yeni bir araç almak için gereken finansmanı hızlıca sağlamış olursunuz.</p>
  `,

  "oto-grade-ile-hasarli-aracinizi-ayni-gun-satmanin-avantajlari": `
<p>Hasarlı bir araca sahip olmak, beraberinde otopark ücretleri, tamir stresi, usta pazarlıkları ve değer kaybı endişesi gibi birçok yükü getirir. Bu yükten kurtulmanın en kolay yolu aracınızı satmaktır. Ancak hasarlı araç satışı, normal bir ikinci el araç satışından çok daha zordur. İşte tam bu noktada <strong>Oto Grade</strong> devreye giriyor ve size benzersiz avantajlar sunuyor.</p>

<h3>⚡ 1. Anında ve Ücretsiz Değerleme</h3>
<p>Aracınızın değerini öğrenmek için kapı kapı sanayi dolaşmanıza veya ilan sitelerinde haftalarca beklemenize gerek yok. Oto Grade'in web sitesi üzerinden aracınızın birkaç fotoğrafını, marka, model ve hasar bilgisini paylaşmanız yeterlidir. Uzman ekibimiz aynı gün içinde size adil ve piyasa şartlarına uygun bir teklif sunar.</p>

<h3>🚛 2. Türkiye'nin Her Yerinden Ücretsiz Çekici Hizmeti</h3>
<p>Hasarlı araçların çoğu trafikte seyredemez durumdadır. Aracı bir alıcıya göstermek için bile çekici tutmanız gerekebilir. Oto Grade, anlaşma sağlandığında aracınız Türkiye'nin neresinde olursa olsun, tamamen kendi lojistik ağıyla ücretsiz çekici gönderir. Aracınız kapınızdan veya bulunduğu otoparktan teslim alınır.</p>

<h3>🚫 3. Sıfır Bürokrasi ve Resmi İşlem Garantisi</h3>
<p>Hasarlı araçların devir işlemleri (çekme belgesi, hurda belgesi çıkarma işlemleri) karmaşık olabilir. Hatalı yapılan devir işlemleri ileride başınıza hukuki dertler açabilir. Oto Grade'in profesyonel operasyon ekibi, tüm noter ve ruhsat işlemlerini eksiksiz, yasal ve güvenli bir şekilde sizin adınıza yürütür.</p>

<h3>💸 4. Aynı Gün Güvenli Nakit Ödeme</h3>
<p>Araç satışında en büyük endişe ödemenin güvenliğidir. Oto Grade, "Önce Devir, Sonra Para" veya "Önce Para, Sonra Devir" gibi ikilemleri ortadan kaldırır. Noter satışı aşamasında, imzalar atılmadan hemen önce anlaşılan tutar kurumsal banka hesabımızdan doğrudan sizin adınıza kayıtlı IBAN numarasına transfer edilir.</p>

<h3>🛡️ 5. Şeffaflık ve Kurumsal Güven</h3>
<p>Sokak arası tamirciler veya belgesiz al-satçılarla yaşanan "son dakika fiyat düşürme" taktikleri Oto Grade'de kesinlikle yaşanmaz. Telefonda veya WhatsApp'ta anlaşılan fiyat neyse, araç belirtilen hasar durumundaysa, noterde kuruşu kuruşuna aynı tutar ödenir.</p>

<p>Siz de zamanınızı ve enerjinizi tüketmeden hasarlı aracınızı değerinde satmak istiyorsanız, Oto Grade'in profesyonel dünyasına adım atın. <strong>Hemen teklif alın, aynı gün ödemenizi alın!</strong></p>
  `
};

async function run() {
  for (const [slug, content] of Object.entries(richBlogs)) {
    const { error } = await supabase
      .from('hazaral_blogs')
      .update({ content })
      .eq('slug', slug);
      
    if (error) {
      console.error(`Failed to update ${slug}:`, error.message);
    } else {
      console.log(`Successfully updated blog: ${slug}`);
    }
  }
}

run();
