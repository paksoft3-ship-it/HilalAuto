import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const iconCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary mt-[2px] shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const iconAlert = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary shrink-0 mt-1"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
const iconArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block ml-[4px]"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
const iconInfo = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary mt-1 shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

const richBlogs = {
  "hasarli-arac-satarken-dikkat-edilmesi-gerekenler": `
<p>Hasarlı bir araç satmak, normal ikinci el araç satışından çok daha karmaşık ve dikkat gerektiren bir süreçtir. Aracınızın değerini doğru belirlemek, yasal süreçleri eksiksiz tamamlamak ve güvenilir bir alıcı bulmak, ileride yaşanabilecek ciddi hukuki ve maddi sorunların önüne geçer. Oto Grade olarak, yılların getirdiği tecrübeyle hasarlı araç satarken hayat kurtaracak kapsamlı bir rehber hazırladık.</p>

<h3>En Sık Yapılan Büyük Hatalar</h3>
<p>Pek çok araç sahibi, kaza sonrası yaşadığı stres ve aciliyet duygusuyla yanlış kararlar verebilmektedir. Aşağıdaki kritik hatalardan kaçınmak, aracınızı satarken zarar etmenizi engelleyecektir:</p>
<ul class="list-none pl-0">
  <li class="flex items-start gap-3 mb-3">${iconAlert}<span><strong>Değerini Bilmeden Satmak:</strong> Aracınız kazalı, pert veya hurda olsa dahi bir "sovtaj" (kurtarılabilir parça ve metal) değeri vardır. Aceleyle ilk gelen teklifi kabul etmek yerine piyasa araştırması yapmalısınız. <a href="/tr/teklif-al" class="font-medium text-primary hover:underline">Ücretsiz uzman değerlemesi almak için tıklayın</a>.</span></li>
  <li class="flex items-start gap-3 mb-3">${iconAlert}<span><strong>Evrak İşlerini İhmal Etmek:</strong> Satış noterden yapılmadan aracı "güven" üzerine teslim etmek hukuki facialara yol açabilir. Çekme belgesi veya resmi noter satışı kesinlikle şarttır.</span></li>
  <li class="flex items-start gap-3 mb-3">${iconAlert}<span><strong>Merdiven Altı Alıcılara Güvenmek:</strong> Başlangıçta yüksek fiyat verip, notere gidildiğinde "şurada da hasar varmış" diyerek fiyattan ciddi kesintiler yapmaya çalışan profesyonel olmayan kişilerle zaman kaybetmeyin.</span></li>
</ul>

<div class="bg-surface-variant p-6 rounded-[14px] border-l-4 border-primary my-8 flex gap-4 items-start shadow-sm">
  ${iconInfo}
  <div>
    <h4 class="font-bold text-on-surface mt-0 mb-2">Uzman Tavsiyesi: Çekme Belgesi Süreci</h4>
    <p class="text-muted-text mb-0 text-sm">Eğer aracınız ağır hasarlıysa ve bir daha trafiğe çıkamayacak durumdaysa, noter satışı öncesinde aracı trafikten çekip "Çekme Belgeli" statüsüne getirmeniz gerekmektedir. Bu işlem, aracın vergi borcu ve trafik cezası gibi yükümlülüklerinden sizi tamamen kurtarır. Daha fazla bilgi için <a href="/tr/hizmet/cekme-belgeli-arac-alimi" class="font-medium text-primary hover:underline">Çekme Belgeli Araç Alımı hizmetimize göz atın</a>.</p>
  </div>
</div>

<h3>Başarılı Bir Satış İçin Altın Kurallar</h3>
<p>Aracınızı sorunsuz, hızlı ve değerinde satmak istiyorsanız şu profesyonel adımları izlemelisiniz:</p>
<ol>
  <li><strong>Kapsamlı Fotoğraf Çekin:</strong> Aracın her açısından (ön, arka, yanlar, tavan ve motor içi) net fotoğraflar alın. Şeffaflık her zaman güven yaratır ve doğru fiyatlandırma yapılmasını sağlar.</li>
  <li><strong>Evrakları Hazırlayın:</strong> Ruhsat, varsa eksper raporu, hasar kaydı (Tramer) dökümü ve "borcu yoktur" kağıdını elinizin altında bulundurun.</li>
  <li><strong>Kurumsal Alıcı Tercih Edin:</strong> Kurumsal firmalar bürokratik süreci sizin adınıza yönetir, noter masraflarını karşılar ve anında nakit ödeme yapar.</li>
</ol>

<h3>Neden Oto Grade'i Seçmelisiniz?</h3>
<p>Oto Grade, hasarlı aracınızı satarken sizi tüm bu yorucu prosedürlerden tamamen kurtarır. Geniş operasyon ağımız sayesinde, aracınızın bulunduğu konuma <strong>Türkiye'nin her yerinden ücretsiz çekici</strong> gönderiyoruz. Şeffaf ekspertiz sürecimiz sonrasında anlaşılan tutar, noterde imzalar atılmadan saniyeler önce kurumsal banka hesabımızdan doğrudan sizin adınıza kayıtlı hesaba transfer edilir.</p>
<p>Belirsizlikle ve stresle uğraşmayın, kurumsal hizmetin rahatlığını yaşayın. Sürecin nasıl işlediğini merak ediyorsanız <a href="/tr/nasil-calisir" class="font-medium text-primary hover:underline inline-flex items-center">Nasıl Çalışır sayfamızı ziyaret edebilirsiniz ${iconArrow}</a></p>
  `,
  
  "hurda-ve-pert-arac-satisi-rehberi": `
<p>Beklenmedik bir trafik kazası veya sel, dolu gibi doğal afetler sonrasında aracınız kullanılamaz hale gelebilir. Bu gibi durumlarda aracınız "pert" (tam hasarlı) veya "hurda" statüsüne düşer. Çoğu araç sahibi bu iki kavramı birbirine karıştırsa da, yasal ve ticari anlamda aralarında büyük farklar vardır. Aracınızı doğru şekilde değerlendirmek, kaza sonrası maddi kaybınızı minimize etmenin en kritik adımıdır.</p>

<h3>Pert (Ağır Hasarlı) ile Hurda Arasındaki Temel Farklar</h3>
<p>Sürece başlamadan önce elinizdeki aracın yasal statüsünü doğru anlamanız gerekir. Bu statü, aracın satış fiyatını doğrudan belirler:</p>
<ul class="list-none pl-0">
  <li class="flex items-start gap-3 mb-3">${iconCheck}<span><strong>Pert (Ağır Hasarlı) Araçlar:</strong> Kaza sonrasında onarım masrafları, aracın piyasa değerinin (rayiç bedelinin) %70'ini aşan araçlardır. Sigorta şirketleri bu araçları ekonomik nedenlerle "tam hasarlı" kabul eder. Ancak bu araçlar onarılıp, sıkı bir TÜVTÜRK muayenesinden geçtikten sonra tekrar trafiğe dönebilir. <a href="/tr/hizmet/pert-arac-alimi" class="text-primary hover:underline font-medium">Pert araç satışı hakkında detaylı bilgi alın.</a></span></li>
  <li class="flex items-start gap-3 mb-3">${iconCheck}<span><strong>Hurda Araçlar:</strong> Kesinlikle onarılamayacak boyutta hasar görmüş, şasi bütünlüğünü tamamen kaybetmiş ve trafikten sonsuza dek men edilmiş araçlardır. Bu araçların sadece metal ağırlığı ve bazı kurtarılabilir yedek parçaları değer taşır. <a href="/tr/hizmet/hurda-arac-alimi" class="text-primary hover:underline font-medium">Hurda aracınızı nakde çevirmek için tıklayın.</a></span></li>
</ul>

<h3>Satış Öncesi Gereken Kritik Belgeler Nelerdir?</h3>
<p>Bu tür araçları satarken standart ikinci el araçlardaki gibi doğrudan ruhsat devri yapılamaz. Yasal zorunluluklar gereği aracın durumuna uygun belgenin çıkarılması şarttır:</p>
<ol>
  <li><strong>Çekme Belgesi:</strong> Aracın trafikten çekildiğini, motorlu taşıtlar vergisi (MTV) borcunun işlemediğini gösteren belgedir. İleride onarılıp trafiğe dönecek ağır hasarlı araçlar bu belge ile satılır.</li>
  <li><strong>Hurda Belgesi:</strong> Aracın tamamen hurdaya ayrıldığını ve bir daha asla trafiğe çıkamayacağını kanıtlar. Bu belge olmadan, aracı bir geri dönüşüm veya parça tesisine satmak yasa dışıdır.</li>
</ol>

<div class="bg-surface-variant p-6 rounded-[14px] border-l-4 border-primary my-8 flex gap-4 items-start shadow-sm">
  ${iconInfo}
  <div>
    <h4 class="font-bold text-on-surface mt-0 mb-2">Sigorta Şirketinin Teklifini Hemen Kabul Etmeli misiniz?</h4>
    <p class="text-muted-text mb-0 text-sm">Aracınız pert olduğunda sigorta şirketi size iki seçenek sunar: Aracı onlara devredip tam rayiç bedeli almak ya da aracı sizde bırakıp "sovtaj (hurda/enkaz) bedelini" düşerek kısmi bir ödeme almak. <strong>İşte altın kural:</strong> Sigortanın size sunduğu sovtaj kesintisini öğrenin ve ardından piyasadan bağımsız bir teklif alın. Çoğu zaman sigortanın belirlediği sovtaj kesintisi, aracın serbest piyasadaki değerinden düşüktür. Aracı doğrudan siz satarak çok daha fazla kâr elde edebilirsiniz!</p>
  </div>
</div>

<h3>Hurda ve Pert Satışında Oto Grade Ayrıcalığı</h3>
<p>Oto Grade olarak, pert ve hurda araçlarınızı bürokrasiye boğulmadan satmanızı sağlıyoruz. Uzman ekibimiz çekme ve hurda belgesi çıkarma işlemlerinde size ücretsiz danışmanlık sunar. Çalışmayan, motoru kilitlenmiş veya şasisi dağılmış araçlarınız için özel taşıma ekipmanlarıyla Türkiye'nin her yerine ulaşıyor, ücretsiz çekici hizmeti sağlıyoruz. Aracınızın gerçek değerini öğrenmek ve aynı gün içinde nakit ödeme almak için <a href="/tr/teklif-al" class="font-medium text-primary hover:underline inline-flex items-center">ücretsiz teklif formumuzu doldurabilirsiniz ${iconArrow}</a></p>
  `,

  "buyuksehirlerde-hasarli-arac-satisi": `
<p>İstanbul, Ankara, İzmir veya Antalya gibi büyükşehirlerde yaşıyorsanız ve hasarlı bir aracınız varsa, satış süreci hem avantajlı hem de zorlu olabilir. Büyükşehirler, potansiyel alıcıların ve tamirhanelerin fazla olduğu yerler olsa da, devasa lojistik engeller, inanılmaz boyutlara ulaşan otopark ücretleri ve karmaşık çekici süreçleri sizi ciddi şekilde yıpratabilir. Oto Grade gibi kurumsal ve geniş ağa sahip bir firma ile çalışmak, büyükşehirlerde hayat kurtaran bir hamledir.</p>

<h3>Büyükşehirlerde Hasarlı Araç Satışının Lojistik Kabusları</h3>
<p>Aracınız kaza yaptı ve şu an bir yediemin otoparkında veya sanayi sitesinde bekliyor. Süreci kendiniz yönetmeye kalkarsanız şu büyük sorunlarla yüzleşirsiniz:</p>
<ul class="list-none pl-0">
  <li class="flex items-start gap-3 mb-3">${iconAlert}<span><strong>Astronomik Otopark Ücretleri:</strong> Özellikle İstanbul, Ankara ve İzmir merkezlerindeki yediemin otoparkları veya özel servislerin günlük işgaliye ücretleri çok yüksektir. Karar verme sürecinizi bir hafta uzatmanız bile binlerce lira zarar etmenize yol açar.</span></li>
  <li class="flex items-start gap-3 mb-3">${iconAlert}<span><strong>Fahiş Çekici Maliyetleri:</strong> Aracı farklı alıcılara göstermek, ekspertize sokmak veya başka bir tamirhaneye taşımak için defalarca çekici çağırmak zorunda kalırsınız. İstanbul'da iki yaka arasında hasarlı araç taşımanın maliyeti bütçenizi ciddi şekilde sarsar.</span></li>
  <li class="flex items-start gap-3 mb-3">${iconAlert}<span><strong>Trafik ve Zaman İsrafı:</strong> Potansiyel alıcılarla buluşmak, bitmek bilmeyen pazarlıklar yapmak ve resmi noter işlemlerini halletmek için büyükşehir trafiğinde işinizden izin almak ve tam gününüzü harcamak zorundasınız.</span></li>
</ul>

<h3>Oto Grade'in Büyükşehir Çözümleri</h3>
<p>Oto Grade, geniş operasyon ağı ve profesyonel ekibiyle bu coğrafi ve lojistik dezavantajları tamamen ortadan kaldırır. Şehir şehir özel hizmet ağımızı nasıl yönettiğimize göz atalım:</p>

<div class="bg-surface-variant p-6 rounded-[14px] border-l-4 border-primary my-8 shadow-sm">
  <h4 class="font-bold text-on-surface mt-0 mb-4">📍 Ankara, İstanbul ve İzmir Özel Çözümleri</h4>
  <p class="text-muted-text mb-4 text-sm">Bu üç büyük metropolde, Oto Grade eksperleri aracınızın bulunduğu konuma (yediemin, evinizin önü veya sanayi sitesi) hızla ulaşır. Hızlı teklif onayınızın ardından, aracınız otoparkta rehin kalmaz, günlük ücretlerden anında kurtulursunuz. Noter işlemleri, size en yakın veya sizin belirlediğiniz lokasyondaki noterliklerde organize edilir.</p>
  <h4 class="font-bold text-on-surface mt-0 mb-2">📍 Antalya ve Kıyı Bölgeleri Lojistiği</h4>
  <p class="text-muted-text mb-0 text-sm">Yaz aylarında yaşanan yüksek yoğunluklu otoyol kazaları veya kışın görülen sel baskınları sonrası Antalya ve çevresinde profesyonel çekici bulmak büyük bir krizdir. Oto Grade, kendi çekici filosu ile sahil bandından dağ köylerine kadar her noktadan sel hasarlı veya kazalı aracınızı ücretsiz teslim alır.</p>
</div>

<h3>Neden Oto Grade ile Çalışmalısınız?</h3>
<p>Oto Grade ile çalışırken evinizden veya ofisinizden çıkmanıza gerek kalmaz. Sadece web sitemiz üzerinden <a href="/tr/teklif-al" class="font-medium text-primary hover:underline">teklif formunu</a> doldurarak fotoğrafları gönderirsiniz. Anlaşma sağlandığı an ekibimiz aracı bulunduğu yerden alır, resmi noter işlemini sizin için kolaylaştırır ve anında nakit ödeme yapar. Büyükşehir karmaşasını, otopark faturalarını ve lojistik sorunları tamamen bize bırakın. <a href="/tr/iletisim" class="font-medium text-primary hover:underline inline-flex items-center">İletişim sayfamızdan bize anında ulaşabilirsiniz ${iconArrow}</a></p>
  `,

  "2026-hasarli-arac-satarken-5-ipucu": `
<p>Otomotiv sektörü eşi benzeri görülmemiş bir hızla değişiyor. 2026 yılına geldiğimizde; elektrikli araç dönüşümleri, artan lojistik ve yedek parça maliyetleri, ekonomik dalgalanmalar ve dijitalleşme, hasarlı araç satış dinamiklerini kökten değiştirdi. "Hasarlı aracı ucuza toplayıp sanayide hallederiz" devri çoktan kapandı. İşte bu yeni ve modern dönemde aracınızı satarken zarar etmemeniz için bilmeniz gereken 5 hayati ipucu.</p>

<h3>1. Onarım Maliyetlerini Doğru Hesaplayın</h3>
<p>2026 yılında döviz kurlarındaki hareketlilik ve global tedarik zincirindeki yavaşlamalar nedeniyle orijinal yedek parça fiyatları astronomik seviyelere ulaştı. Aracınızı tamir ettirmenin eskisinden çok daha maliyetli olduğunu unutmayın. Çoğu ağır hasar durumunda, "tamir ettirip piyasada sağlam olarak satmak" yerine "aracı mevcut hasarlı haliyle profesyonellere satmak" kesinlikle daha kârlı bir finansal matematik sunuyor.</p>

<h3>2. Dijital Ekspertizi Avantaja Çevirin</h3>
<p>Geçmişte hasarlı bir aracı satmak için onlarca alıcının aracı fiziksel olarak görmesi gerekirdi. Bugün ise teknoloji yanınızda. Oto Grade gibi kurumsal firmalar, yüksek çözünürlüklü fotoğraflar ve videolar üzerinden yapay zeka destekli hasar tespitleri yapabilmektedir. Aracınızı bulunduğu yerden bir santim bile hareket ettirmeden, dijital kanallar üzerinden anında kurumsal fiyatlandırma talep edin. <a href="/tr/satilik-araclar" class="font-medium text-primary hover:underline">Hangi araçları aldığımızı görmek için pazar yerimize göz atın.</a></p>

<h3>3. Hızlı Karar Verin, Araç Bekledikçe Değer Kaybeder</h3>
<p>Enflasyonist ekonomik ortamlarda karar sürecini uzatmak her zaman para kaybettirir. Özellikle elektronik aksamı açıkta kalmış, ağır hasar görmüş araçlar veya <a href="/tr/hizmet/sel-hasarli-arac-alimi" class="font-medium text-primary hover:underline">sel hasarlı araçlar</a>, bekledikçe paslanma, korozyon ve oksidasyon nedeniyle her geçen gün kurtarılabilir parça değerlerini kaybederler. Hızlı hareket ederek aracınızı bir an önce nakde çevirmek 2026'nın tartışmasız en iyi stratejisidir.</p>

<div class="bg-surface-variant p-6 rounded-[14px] border-l-4 border-primary my-8 shadow-sm">
  <h4 class="font-bold text-on-surface mt-0 mb-2">4. Yasal Prosedürlerde Taviz Vermeyin</h4>
  <p class="text-muted-text mb-0 text-sm">Yasal düzenlemeler 2026 itibarıyla çok daha sıkı hale geldi. Resmi noter satışı veya "çekme belgesi" devri tam olarak yapılmadan aracı "aramızda bir sözleşme imzalayarak" teslim etmek, aracı alan kişinin karıştığı her türlü suç veya yediği trafik cezasından yasal olarak sizin sorumlu tutulmanıza neden olur. Resmi prosedürleri atlayan geleneksel al-satçılardan kesinlikle uzak durun.</p>
</div>

<h3>5. Güvenilir, Güçlü Sermayeli Partnerler Seçin</h3>
<p>Bireysel alıcıların kredi bulmakta ve finansmana erişmekte zorlandığı günümüz ekonomik koşullarında, peşin ödeme gücüne sahip kurumsal firmalarla çalışmak esastır. Güçlü sermayesi ve kurumsal altyapısı ile Oto Grade, aracınızın değeri ne olursa olsun anlaşılan rakamı, noterde resmi imza atılmadan saniyeler önce banka hesabınıza kuruşu kuruşuna transfer eder. Şirketimiz hakkında daha fazla bilgi almak için <a href="/tr/hakkimizda" class="font-medium text-primary hover:underline inline-flex items-center">Hakkımızda sayfamızı inceleyebilirsiniz ${iconArrow}</a></p>
  `,

  "araciniz-kaza-sonrasi-pert-oldugunda-ne-yapmalisiniz": `
<p>Büyük bir trafik kazası geçirmek, herkes için son derece sarsıcı ve travmatik bir deneyimdir. Fiziksel olarak herhangi bir yara almamış olsanız bile, kazanın hemen sonrasında aracınızın durumuyla ilgili atmanız gereken resmi, hukuki ve teknik adımlar kafa karıştırıcı bir stres kaynağı olabilir. Kaza sonrası aracınızın hasar onarım bedeli, aracın piyasadaki rayiç bedelinin (güncel piyasa değerinin) %70'ine veya daha fazlasına ulaştığında yasal olarak "Pert (Tam Hasarlı)" kararı verilir. Peki bu noktadan sonra panik yapmadan ne yapmalısınız? İşte adım adım rehberiniz.</p>

<h3>1. Kaza Anı ve Resmi Tespitlerin Yapılması</h3>
<p>Kazanın hemen ardından öncelikle çevrenin ve kendi güvenliğinizi sağlayın. İhtiyaç durumunda ambulans ve mutlaka polis/jandarma ekiplerini çağırarak olay yerinde <strong>resmi kaza tespit tutanağının</strong> tutulmasını sağlayın. Eğer aracınız kaskoluysa, yasal olarak kazayı takip eden <strong>5 iş günü</strong> içinde durumu sigorta şirketinize bildirmekle yükümlüsünüz. Sigorta şirketi hızla bir eksper atayacak ve aracınızın onarım maliyetini detaylıca hesaplayacaktır.</p>

<h3>2. Pert (Tam Hasarlı) Kararının Çıkması ve Seçenekleriniz</h3>
<p>Eksper incelemesi sonucunda, aracın onarım masraflarının ekonomik olmadığına (tamir etmenin aracın değerini aştığına) kanaat getirilirse araç "pert" kabul edilir. Bu kritik aşamada sigorta şirketiniz size iki yasal seçenek sunar:</p>
<ul class="list-none pl-0">
  <li class="flex items-start gap-3 mb-3">${iconCheck}<span><strong>Aracı Sigorta Şirketine Bırakmak:</strong> Sigorta şirketi size aracın kaza anındaki piyasa rayiç bedelini nakit olarak öder ve aracın mülkiyetini kalıcı olarak kendi üstüne alır. Aracın hurdasıyla onlar ilgilenir.</span></li>
  <li class="flex items-start gap-3 mb-3">${iconCheck}<span><strong>Aracı Geri Almak (Sovtaj Bedeli Kesintisi):</strong> Sigorta şirketi, hasarlı aracın piyasada bir "hurda/sovtaj" değeri olduğunu belirtir. Bu sovtaj değerini size ödeyeceği toplam rayiç bedelden düşerek kalan tutarı size öder ve hasarlı aracı size bırakır.</span></li>
</ul>

<div class="bg-surface-variant p-6 rounded-[14px] border-l-4 border-primary my-8 shadow-sm">
  <h4 class="font-bold text-on-surface mt-0 mb-2">Hangi Seçenek Finansal Olarak Daha Avantajlı?</h4>
  <p class="text-muted-text mb-0 text-sm">Birçok araç sahibinin bilmediği altın kural şudur: Çoğu zaman sigorta şirketlerinin size teklif ettiği sovtaj bedeli kesintisi (aracın hurda saydıkları değeri), aracın serbest piyasadaki gerçek hurda/pert değerinden çok daha yüksektir. Yani aracı kendiniz tutup Oto Grade gibi profesyonel kurumlara sattığınızda, sigortanın kestiği paradan daha fazlasını elde edersiniz ve toplam cebinize giren para artar. <strong>Sigortanın teklifini kabul etmeden önce mutlaka piyasadan bağımsız teklif alın.</strong> <a href="/tr/hizmet/agir-hasarli-arac-alimi" class="text-primary hover:underline font-medium">Ağır hasarlı araç alımı süreçlerimizi inceleyin.</a></p>
</div>

<h3>3. Aracı Kendiniz Satmaya Karar Verdiğinizde</h3>
<p>Aracınızı kendiniz satmaya karar verdiyseniz, bitmek bilmeyen bürokrasiyle, sanayi köşelerinde değer düşürmeye çalışan alıcılarla boğuşmak zorunda değilsiniz. <a href="/tr/hizmet/pert-arac-alimi" class="text-primary hover:underline">Pert araç alımı</a> konusunda uzmanlaşmış <strong>Oto Grade</strong>, ağır hasarlı veya pert kayıtlı araçlarınızı en yüksek fiyat garantisiyle satın alır.</p>

<h3>4. Oto Grade ile Hızlı, Güvenli Çözüm</h3>
<p>Pert araç satışında en büyük yorgunluk lojistik planlama ve resmi evrak işlemleridir. Oto Grade bu yükü omuzlarınızdan alır. Aracınızı bulunduğu otoparktan tamamen ücretsiz çeker, tüm çekme/hurda belgesi ve noter masraflarını karşılar. Ödemeniz aynı gün içinde, şeffaf ve kurumsal bir süreçle banka hesabınıza yapılır. Yeni bir araç almak için gereken bütçeyi beklemeden, aynı gün içinde hızlıca sağlamış olursunuz. Süreci başlatmak için <a href="/tr/teklif-al" class="font-medium text-primary hover:underline inline-flex items-center">bugün ücretsiz teklif isteyin ${iconArrow}</a></p>
  `,

  "oto-grade-ile-hasarli-aracinizi-ayni-gun-satmanin-avantajlari": `
<p>Hasarlı bir araca sahip olmak; yüksek otopark ücretleri, bitmek bilmeyen tamir stresleri, usta pazarlıkları, yedek parça arayışı ve değer kaybı endişesi gibi birçok yükü beraberinde getirir. Tüm bu karmaşadan kurtulmanın en mantıklı ve kârlı yolu aracı mevcut hasarlı durumuyla satmaktır. Ancak hasarlı araç satışı, normal bir ikinci el araç satışından çok daha güvensiz ve zorlu bir piyasaya sahiptir. İşte tam bu noktada sektörün kurumsal yüzü <strong>Oto Grade</strong> devreye giriyor ve size benzersiz, güvenilir avantajlar sunuyor.</p>

<h3>1. Anında, Ücretsiz ve Adil Değerleme</h3>
<p>Aracınızın gerçek piyasa değerini öğrenmek için kapı kapı sanayi sitelerini dolaşmanıza veya ilan sitelerinde aylarca bekleyip yüzlerce gereksiz telefon çağrısı almanıza gerek yok. Oto Grade'in dijital platformu üzerinden aracınızın birkaç net fotoğrafını, marka, model ve genel hasar bilgisini paylaşmanız yeterlidir. <a href="/tr/teklif-al" class="font-medium text-primary hover:underline">Uzman ekspertiz ekibimiz aynı gün içinde size adil ve güncel piyasa şartlarına uygun bir teklif sunar.</a></p>

<h3>2. Türkiye'nin Her Yerinden Ücretsiz Çekici Hizmeti</h3>
<p>Hasarlı araçların büyük bir çoğunluğu mekanik nedenlerle veya yasal engellerle trafikte seyredemez durumdadır. Aracı potansiyel bir alıcıya veya ekspertize göstermek için bile yüksek maliyetli çekici tutmanız gerekebilir. Oto Grade, anlaşma sağlandığında aracınız Türkiye'nin neresinde olursa olsun, tamamen kendi geniş lojistik ağıyla ücretsiz çekici gönderir. Aracınız evinizin kapısından veya bulunduğu yediemin otoparkından masrafsız teslim alınır.</p>

<div class="bg-surface-variant p-6 rounded-[14px] border-l-4 border-primary my-8 shadow-sm">
  <h4 class="font-bold text-on-surface mt-0 mb-2">3. Sıfır Bürokrasi ve Hukuki Güvence</h4>
  <p class="text-muted-text mb-0 text-sm">Hasarlı araçların resmi devir işlemleri (çekme belgesi çıkarma, hurda belgesi alma, muayene veya vergi borcu çözümleme işlemleri) sıradan vatandaşlar için oldukça karmaşık ve yorucudur. Hatalı yapılan veya yarım bırakılan devir işlemleri ileride başınıza maliye ve emniyet ile hukuki dertler açabilir. Oto Grade'in alanında uzman profesyonel operasyon ekibi, tüm bu noter ve ruhsat süreçlerini eksiksiz, tamamen yasalara uygun ve güvenli bir şekilde sizin adınıza yürütür.</p>
</div>

<h3>4. Aynı Gün İçinde Güvenli Nakit Ödeme</h3>
<p>Araç satışında, özellikle tanımadığınız kişilere araç satarken en büyük endişe ödemenin güvenliği ve karşılıksız çıkma riskidir. Oto Grade, "Önce Devir, Sonra Para" veya "Önce Para, Sonra Devir" gibi gerilimli ikilemleri ortadan kaldırır. Tüm süreç Noterlik Sistemi güvencesiyle işler; noter satışı aşamasında, imzalar atılmadan saniyeler önce anlaşılan tutar kurumsal şirket banka hesabımızdan doğrudan sizin adınıza kayıtlı IBAN numarasına transfer edilir.</p>

<h3>5. Kurumsal Şeffaflık ve Verilen Sözün Tutulması</h3>
<p>Piyasada sıkça karşılaşılan, sokak arası al-satçılarla yaşanan "aracı görmeye gelip son dakika binlerce lira fiyat düşürme" taktikleri Oto Grade sisteminde kesinlikle barınamaz. Telefonda veya WhatsApp'ta uzmanlarımızla anlaşılan fiyat neyse, araç belirtilen hasar durumuna uyduğu takdirde, noterde kuruşu kuruşuna aynı tutar ödenir. Şeffaflık temel ilkemizdir.</p>

<p>Siz de zamanınızı, paranızı ve enerjinizi tüketmeden hasarlı aracınızı en güvenli yoldan, değerinde satmak istiyorsanız, Oto Grade'in kurumsal dünyasına adım atın. <strong><a href="/tr/nasil-calisir" class="font-medium text-primary hover:underline">Sürecin nasıl işlediğini inceleyin</a> ve bugün anında nakit ödemenizi alın!</strong></p>
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
