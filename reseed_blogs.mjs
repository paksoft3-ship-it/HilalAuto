import pg from 'pg';

const connectionString = "postgres://postgres.hgkvzlwwisuijygzpmbr:aLv4kR3h82MX9cVp@aws-1-eu-central-1.pooler.supabase.com:5432/postgres";

const pool = new pg.Pool({
  connectionString,
});

const blogs = [
  {
    slug: 'hasarli-arac-satarken-dikkat-edilmesi-gerekenler',
    title: 'Hasarlı Araç Satarken Dikkat Edilmesi Gerekenler: Kimler Alır, Nasıl İşler?',
    excerpt: 'Kazalı veya hasarlı aracınızı satarken nelere dikkat etmelisiniz? Bireysel alıcılarla uğraşmak yerine profesyonel firmalara satmanın avantajları nelerdir?',
    content: `
      <h2>Hasarlı Araç Satışı Neden Zorludur?</h2>
      <p>Kazalı veya ağır hasarlı bir aracı satmak, normal bir ikinci el araç satışından çok daha karmaşıktır. Bireysel alıcılar genellikle bu araçlara şüpheyle yaklaşır ve piyasa değerinin çok altında teklifler verirler. Ayrıca aracın çekilmesi, noter devir işlemleri ve ekspertiz süreçleri ciddi bir zaman ve maliyet gerektirir. Eğer aracınız <a href="/tr/hizmet/kazali-arac-alimi">kazalı araç</a> veya <a href="/tr/hizmet/agir-hasarli-arac-alimi">ağır hasarlı araç</a> statüsündeyse, bireysel satış yapmak neredeyse imkansız hale gelebilir.</p>
      
      <h2>Bireysel Alıcı vs. Profesyonel Firma Karşılaştırması</h2>
      <p>Aracınızı satarken karşılaşacağınız en büyük ikilem, "Kime satmalıyım?" sorusudur. İşte bireysel alıcılar ile HazarAl gibi kurumsal firmalar arasındaki temel farklar:</p>
      <ul>
        <li><strong>Fiyat Teklifi:</strong> Bireysel alıcılar genellikle fırsatçılık yaparak piyasa değerinin çok altında "ölü fiyat" verirler. HazarAl ise yedek parça ve geri dönüşüm ağı sayesinde piyasa değerinde adil teklif sunar.</li>
        <li><strong>Çekici Hizmeti:</strong> Aracınız yürür durumda değilse, çekici maliyeti size ait olur. Profesyonel firmalar aracı bulunduğu yerden <strong>ücretsiz çekici</strong> ile alırlar.</li>
        <li><strong>Süreç Hızı:</strong> Bireysel satış haftalar veya aylar sürebilirken, HazarAl ile süreç genellikle aynı gün içinde tamamlanır.</li>
        <li><strong>Güvenlik ve Ödeme:</strong> Noter devri sırasında ödeme alamama veya dolandırılma riski bireysel satışlarda yüksektir. Kurumsal firmalarla %100 güvence altındasınızdır.</li>
      </ul>

      <h2>HazarAl ile Süreç Nasıl İşler?</h2>
      <p>HazarAl olarak süreci sizin için tamamen şeffaf ve zahmetsiz hale getirdik. Aşağıdaki adımları takip ederek aracınızı aynı gün nakite çevirebilirsiniz:</p>
      <ol>
        <li><strong>Fotoğraf Gönderin:</strong> Aracınızın fotoğraflarını ve ruhsat bilgilerini WhatsApp üzerinden veya <a href="/tr/teklif-al">ücretsiz teklif al formumuz</a> aracılığıyla bize iletin.</li>
        <li><strong>Anında Teklif Alın:</strong> Uzman ekspertiz ekibimiz aracınızı inceler ve size en adil fiyat teklifini sunar. Bu teklif bağlayıcı değildir.</li>
        <li><strong>Ücretsiz Çekici:</strong> Teklifi kabul ettiğinizde, Türkiye'nin neresinde olursanız olun aracınızı yerinden ücretsiz alıyoruz.</li>
        <li><strong>Nakit Ödeme:</strong> Noter devri ile eş zamanlı olarak ödemeniz banka hesabınıza veya nakit olarak elinize geçer.</li>
      </ol>
      
      <blockquote>
        <p>"Aracınızı satarken değer kaybı yaşamamak, çekici masraflarından kurtulmak ve yasal sorumlulukları devretmek için her zaman kurumsal firmaları tercih edin. Güvenlik her şeyden önemlidir."</p>
      </blockquote>
      
      <h2>Sonuç</h2>
      <p>Hasarlı veya kazalı aracınızı satmak artık stresli bir süreç olmak zorunda değil. Doğru firmayı seçerek hem zamandan hem de paradan tasarruf edebilirsiniz. Araç durumu ne olursa olsun, hemen uzman ekibimizle iletişime geçin.</p>
    `,
    image_url: '/images/blog/blog_1_selling_damaged_car.png',
    status: 'published',
    locale: 'tr',
  },
  {
    slug: 'hurda-ve-pert-arac-satisi-rehberi',
    title: 'Hurda ve Pert Araç Satışı: En İyi Fiyatı Veren Hurda Araç Alan Yerler Rehberi',
    excerpt: 'Aracınız ağır hasar mı aldı? Hangi durumlarda aracınız hurdaya ayrılır veya pert sayılır? Ağır hasarlı ve hurda araçlarınızı en yüksek fiyatla kime satabilirsiniz?',
    content: `
      <h2>Pert Araç Nedir? Ne Zaman Hurdaya Çıkarılır?</h2>
      <p>Bir aracın onarım masraflarının, güncel rayiç bedelinin %70'ini aşması durumunda o araç <strong>Tam Hasarlı (Pert)</strong> olarak nitelendirilir. Eğer araç onarılamayacak kadar ağır hasar almışsa, trafikten çekilerek "Hurda Belgeli" statüsüne alınır. <a href="/tr/hizmet/pert-arac-alimi">Pert araç satışı</a>, yasal olarak özel prosedürler gerektiren dikkatli olunması gereken bir süreçtir.</p>

      <h2>Hurda Araç Satışında Dikkat Edilmesi Gereken Yasal Süreçler</h2>
      <p>Hurda aracınızı satarken yasal sorunlarla karşılaşmamak için aşağıdaki adımlara kesinlikle dikkat etmelisiniz:</p>
      <ul>
        <li><strong>Noter Devri Şartı:</strong> Aracınızı hurda olarak satarken bile kesinlikle noter üzerinden devir yapmalısınız. Aksi takdirde, aracın şasisi kullanılarak yapılacak yasa dışı işlemlerden, trafik cezalarından veya suça karışma durumlarından sorumlu tutulabilirsiniz.</li>
        <li><strong>Çekme Belgesi:</strong> Aracı satmadan önce veya satış sırasında "Çekme Belgeli" olduğuna emin olun. Bu belge, aracın vergi ve trafik cezası yükümlülüklerini tamamen durdurur. Eğer aracınız zaten çekme belgeli ise <a href="/tr/hizmet/cekme-belgeli-arac-alimi">çekme belgeli araç alım</a> sayfamızı inceleyebilirsiniz.</li>
        <li><strong>Doğru Fiyatlandırma:</strong> Hurda araçlar sadece bir demir veya metal yığını değildir. Motor bloku, şanzıman veya kaporta aksamındaki sağlam parçalar aracın asıl değerini belirler. Profesyonel geri dönüşüm firmaları bu parçaları değerlendirebildiği için her zaman daha yüksek fiyat teklif ederler.</li>
      </ul>

      <h2>Yanmış ve Sel Görmüş Araçların Durumu</h2>
      <p>Sadece kaza sonucu değil, doğal afetler veya kazalar sonucu <a href="/tr/hizmet/yanmis-arac-alimi">yanmış araç</a> veya <a href="/tr/hizmet/sel-hasarli-arac-alimi">sel hasarlı araç</a> statüsüne düşen otomobillerin onarımı çoğu zaman imkansızdır. Bu araçlarda gizli elektrik hasarları, paslanma ve koku gibi kronik sorunlar onarım sonrası bile devam eder. Bu nedenle bu araçların doğrudan profesyonel alıcılara satılması en doğru yöntemdir.</p>
      
      <h2>HazarAl'ın Hurda ve Pert Araç Alım Hizmeti</h2>
      <p>Türkiye'nin neresinde olursanız olun, ağır hasarlı, yanmış, sel görmüş veya tamamen hurdaya dönmüş araçlarınızı değerinde nakit olarak alıyoruz. <strong>Hurda araba alan yerler</strong> arayışınızda, ücretsiz çekici hizmetimiz ve şeffaf noter devri garantimiz ile her zaman yanınızdayız.</p>
      
      <h3>Sıkça Sorulan Sorular</h3>
      <ul>
        <li><strong>Hurda araç satışı yasal mıdır?</strong> Evet, aracın çekme belgeli olması ve devrinin noter üzerinden yapılması şartıyla tamamen yasaldır. HazarAl bu süreçlerin tamamında size danışmanlık yapar.</li>
        <li><strong>Araç yerinden kalkmıyor, nasıl satacağım?</strong> Endişelenmeyin, aracınızın bulunduğu konuma, aracın hasar durumuna uygun özel ahtapot veya kayar kasa çekicilerimizi ücretsiz olarak yönlendiriyoruz.</li>
      </ul>
    `,
    image_url: '/images/blog/blog_2_scrap_car_valuation.png',
    status: 'published',
    locale: 'tr',
  },
  {
    slug: 'buyuksehirlerde-hasarli-arac-satisi',
    title: 'Büyükşehirlerde Hasarlı Araç Satışı: Ankara, İzmir ve Antalya Rehberi',
    excerpt: 'Büyükşehirlerin trafiğinde kazaya karıştıktan sonra hasarlı aracınızı satmak kabusa dönüşmesin. Ankara, İzmir ve Antalya gibi illerde çekici ve devir süreçleri.',
    content: `
      <h2>Metropollerde Kazalı Araç Satmanın Zorlukları</h2>
      <p>Ankara, İzmir, Antalya ve İstanbul gibi büyükşehirlerde kazaya karışmak, sadece maddi hasarla kalmaz, sonrasında ciddi bir lojistik ve zaman maliyeti doğurur. Kazalı aracın trafiği kapatması, acilen sanayiye çekilmesi gerekliliği, astronomik otopark veya yediemin ücretleri, uzun süre usta beklemek ve sonu gelmeyen değer kaybı pazarlıkları süreci çekilmez hale getirebilir.</p>
      <p>Çoğu araç sahibi, sanayi sitelerinde dükkan dükkan gezerek aracına alıcı bulmaya çalışır. Ancak bu yöntem genellikle aracın gerçek değerinin çok altında satılmasıyla sonuçlanır.</p>
      
      <h2>Bölgesel Farklılıklar ve Şehirlere Özel Çözümler</h2>
      
      <h3>Ankara'da Hasarlı Araç Alım Satımı</h3>
      <p>İç Anadolu'nun merkezi olan Ankara'da Şaşmaz, İvedik ve Ostim gibi büyük sanayi siteleri bulunsa da, yoğunluk nedeniyle kaporta onarım süreleri çok uzundur. <strong>Ankara hasarlı araç alım satım</strong> pazarında, aracınızı aylarca sürecek onarım masrafına ve usta peşinde koşmaya katlanmadan, olduğu haliyle değerinde satmak çoğu zaman en mantıklı finansal karardır. Eğer Ankara'daysanız <a href="/tr/sehir/ankara">Ankara araç alım sayfamızı</a> ziyaret edin.</p>

      <h3>İzmir ve Çevresinde Kazalı Araç Alımı</h3>
      <p>İzmir ve çevresinde (Manisa, Aydın vb.) kazaya karışan veya özellikle kış aylarında sel hasarı gören araçlar için çekici maliyetleri bölgesel mesafelerden dolayı (örneğin Çeşme'den Bornova'ya) çok yüksek olabilir. <strong>İzmir kazalı araç alımı</strong> hizmetimiz ile aracınızı bulunduğu otoparktan, yedieminden veya sanayiden tamamen ücretsiz çekicimizle teslim alıyoruz. Detaylar için <a href="/tr/sehir/izmir">İzmir araç alım</a> sayfamıza bakabilirsiniz.</p>

      <h3>Antalya'da Pert ve Hurda Araç Alım Satımı</h3>
      <p>Önemli bir turizm bölgesi olması sebebiyle özellikle yaz aylarında yoğun trafik kazalarının yaşandığı Antalya'da hava sıcaklığı ve nem, kazalı araçların açık otoparklarda beklemesi durumunda paslanma ve döşeme hasarlarını hızlandırır. Ayrıca yüksek günlük otopark ücretleri bel büker. <strong>Antalya pert alım satım</strong> uzmanlarımız, aynı gün içinde aracınızı değerleyerek sizi bu yüksek otopark ücreti yükünden anında kurtarır. Antalya işlemlerimiz için <a href="/tr/sehir/antalya">Antalya sayfamızı</a> inceleyin.</p>

      <h2>HazarAl Türkiye Geneli Çözümü</h2>
      <p>Hangi şehirde olursanız olun, ister büyükşehir ister ilçe, HazarAl olarak hasarlı aracınızın bulunduğu konuma özel çekici gönderiyoruz. Sizin sanayi sanayi gezmenize, alıcı aramanıza veya sanal pazar yerlerinde günlerce mesajlara cevap vermenize gerek kalmadan; oturduğunuz yerden, tamamen yasal bir şekilde aracınızı nakite çevirebilirsiniz.</p>
      
      <blockquote>
        <p>"Aracınız nerede olursa olsun, HazarAl'ın geniş lojistik ağı sayesinde aracınızı kapınızdan alıyor ve anında nakit ödeme yapıyoruz. Zamanınız ve paranız size kalsın."</p>
      </blockquote>
    `,
    image_url: '/images/blog/blog_3_city_car_towing.png',
    status: 'published',
    locale: 'tr',
  }
];

async function insertBlogs() {
  console.log("Starting blog insertion via PG...");
  
  try {
    // Delete existing blogs to cleanly reseed
    await pool.query('DELETE FROM public.hazaral_blogs WHERE locale = $1', ['tr']);
    console.log("Cleared existing blogs");

    for (const blog of blogs) {
      console.log(`Inserting blog: ${blog.slug}`);
      await pool.query(`
        INSERT INTO public.hazaral_blogs (slug, title, excerpt, content, image_url, status, locale)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [blog.slug, blog.title, blog.excerpt, blog.content, blog.image_url, blog.status, blog.locale]);
      console.log(`Successfully inserted ${blog.slug}`);
    }
    console.log("Done!");
  } catch (err) {
    console.error("Error inserting blogs:", err);
  } finally {
    await pool.end();
  }
}

insertBlogs();
