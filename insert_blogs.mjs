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
      <p>Kazalı veya ağır hasarlı bir aracı satmak, normal bir ikinci el araç satışından çok daha karmaşıktır. Bireysel alıcılar genellikle bu araçlara şüpheyle yaklaşır ve piyasa değerinin çok altında teklifler verirler. Ayrıca aracın çekilmesi, noter devir işlemleri ve ekspertiz süreçleri ciddi bir zaman ve maliyet gerektirir.</p>
      
      <h2>Bireysel Alıcı vs. Profesyonel Firma Karşılaştırması</h2>
      <div class="overflow-x-auto my-8">
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-2 px-4 border-b text-left">Özellik</th>
              <th class="py-2 px-4 border-b text-left">Bireysel Alıcı</th>
              <th class="py-2 px-4 border-b text-left">Profesyonel Firma (HazarAl)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="py-2 px-4 border-b font-medium">Fiyat Teklifi</td>
              <td class="py-2 px-4 border-b text-red-500">Genellikle ölü fiyat</td>
              <td class="py-2 px-4 border-b text-green-600">Piyasa değerinde adil teklif</td>
            </tr>
            <tr>
              <td class="py-2 px-4 border-b font-medium">Çekici Hizmeti</td>
              <td class="py-2 px-4 border-b text-red-500">Alıcı karşılamaz</td>
              <td class="py-2 px-4 border-b text-green-600">Ücretsiz yerinden teslim</td>
            </tr>
            <tr>
              <td class="py-2 px-4 border-b font-medium">Süreç Hızı</td>
              <td class="py-2 px-4 border-b text-red-500">Haftalar veya aylar sürebilir</td>
              <td class="py-2 px-4 border-b text-green-600">Aynı gün teklif ve devir</td>
            </tr>
            <tr>
              <td class="py-2 px-4 border-b font-medium">Güvenlik</td>
              <td class="py-2 px-4 border-b text-red-500">Dolandırıcılık riski yüksek</td>
              <td class="py-2 px-4 border-b text-green-600">%100 Kurumsal güvence ve anında nakit</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>HazarAl ile Süreç Nasıl İşler?</h2>
      <p><strong>1. Fotoğraf Gönderin:</strong> Aracınızın fotoğraflarını ve ruhsat bilgilerini WhatsApp üzerinden bize iletin.</p>
      <p><strong>2. Anında Teklif Alın:</strong> Uzman ekspertiz ekibimiz aracınızı inceler ve size en adil fiyat teklifini sunar.</p>
      <p><strong>3. Ücretsiz Çekici:</strong> Teklifi kabul ettiğinizde, Türkiye'nin neresinde olursanız olun aracınızı yerinden ücretsiz alıyoruz.</p>
      <p><strong>4. Nakit Ödeme:</strong> Noter devri ile eş zamanlı olarak ödemeniz hesabınıza nakit olarak geçer.</p>
      
      <blockquote><p>"Aracınızı satarken değer kaybı yaşamamak ve yasal sorumluluklardan kurtulmak için kurumsal firmaları tercih edin."</p></blockquote>
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
      <p>Bir aracın onarım masraflarının, güncel rayiç bedelinin %70'ini aşması durumunda o araç <strong>Tam Hasarlı (Pert)</strong> olarak nitelendirilir. Eğer araç onarılamayacak kadar ağır hasar almışsa, trafikten çekilerek "Hurda Belgeli" statüsüne alınır. Bu durumdaki araçların satışı, yasal olarak özel prosedürler gerektirir.</p>

      <h2>Hurda Araç Satışında Dikkat Edilmesi Gerekenler</h2>
      <ul>
        <li><strong>Noter Devri Şartı:</strong> Aracınızı hurda olarak satarken bile kesinlikle noter üzerinden devir yapmalısınız. Aksi takdirde, aracın şasisi kullanılarak yapılacak yasa dışı işlemlerden sorumlu tutulabilirsiniz.</li>
        <li><strong>Çekme Belgesi:</strong> Aracı satmadan önce veya satış sırasında "Çekme Belgeli" olduğuna emin olun. Bu, aracın vergi ve trafik cezası yükümlülüklerini durdurur.</li>
        <li><strong>Doğru Fiyatlandırma:</strong> Hurda araçlar sadece metal yığını değildir. Motor, şanzıman veya kaporta aksamındaki sağlam parçalar aracın değerini belirler. Profesyonel geri dönüşüm firmaları bu parçaları değerlendirebildiği için daha yüksek fiyat teklif ederler.</li>
      </ul>

      <h2>HazarAl'ın Hurda ve Pert Araç Alım Hizmeti</h2>
      <p>Türkiye'nin neresinde olursanız olun, ağır hasarlı, yanmış, sel görmüş veya tamamen hurdaya dönmüş araçlarınızı değerinde nakit olarak alıyoruz. <strong>Hurda araba alan yerler</strong> arayışınızda, ücretsiz çekici hizmetimiz ve şeffaf noter devri garantimiz ile yanınızdayız.</p>
      
      <div class="p-6 bg-blue-50 rounded-lg mt-8 border border-blue-100">
        <h3 class="text-blue-800 mt-0">Sıkça Sorulan Sorular</h3>
        <p class="font-bold mb-1">Hurda araç satışı yasal mıdır?</p>
        <p class="text-sm mb-4">Evet, aracın çekme belgeli olması ve devrinin noter üzerinden yapılması şartıyla tamamen yasaldır.</p>
        
        <p class="font-bold mb-1">Yanmış aracımı satabilir miyim?</p>
        <p class="text-sm">Evet, HazarAl olarak yanmış ve sel hasarlı araçlarınızı da satın alıyoruz.</p>
      </div>
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
      <p>Ankara, İzmir, Antalya ve İstanbul gibi büyükşehirlerde kazaya karışmak, sadece maddi hasarla kalmaz, sonrasında ciddi bir lojistik ve zaman maliyeti doğurur. Kazalı aracın sanayiye çekilmesi, otopark ücretleri, usta beklemek ve değer kaybı pazarlıkları süreci çekilmez hale getirebilir.</p>
      
      <h2>Bölgesel Farklılıklar ve Çözümler</h2>
      
      <h3>Ankara Hasarlı Araç Alım Satım</h3>
      <p>İç Anadolu'nun merkezi olan Ankara'da Şaşmaz ve İvedik gibi büyük sanayi siteleri bulunsa da, kaporta onarım süreleri çok uzundur. <strong>Ankara hasarlı araç alım satım</strong> pazarında, aracınızı onarım masrafına katlanmadan, olduğu haliyle değerinde satmak çoğu zaman en mantıklı finansal karardır.</p>

      <h3>İzmir Kazalı Araç Alımı</h3>
      <p>İzmir ve çevresinde kazaya karışan veya sel hasarı gören araçlar için çekici maliyetleri bölgesel mesafelerden dolayı yüksek olabilir. <strong>İzmir kazalı araç alımı</strong> hizmetimiz ile aracınızı bulunduğu otoparktan veya sanayiden ücretsiz çekicimizle teslim alıyoruz.</p>

      <h3>Antalya Pert Alım Satım</h3>
      <p>Turizm bölgesi olması sebebiyle yoğun trafik kazalarının yaşandığı Antalya'da, özellikle yaz aylarında hasarlı aracınızı otoparkta bekletmek yüksek günlük ücretler doğurur. <strong>Antalya pert alım satım</strong> uzmanlarımız, aynı gün içinde aracınızı değerleyerek otopark ücreti yükünden sizi kurtarır.</p>

      <div class="mt-8 border-l-4 border-primary pl-4 py-2 bg-gray-50">
        <h3 class="text-lg font-bold text-gray-800 mt-0">HazarAl Türkiye Geneli Çözümü</h3>
        <p class="text-sm text-gray-600 mb-0">Hangi şehirde olursanız olun, hasarlı aracınızın bulunduğu konuma özel çekici gönderiyoruz. Sizin sanayi sanayi gezmenize, alıcı aramanıza gerek kalmadan; oturduğunuz yerden, tamamen yasal bir şekilde aracınızı nakite çevirebilirsiniz.</p>
      </div>
    `,
    image_url: '/images/blog/blog_3_city_car_towing.png',
    status: 'published',
    locale: 'tr',
  }
];

async function insertBlogs() {
  console.log("Starting blog insertion via PG...");
  
  try {
    for (const blog of blogs) {
      console.log(`Upserting blog: ${blog.slug}`);
      await pool.query(`
        INSERT INTO public.hazaral_blogs (slug, title, excerpt, content, image_url, status, locale)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          image_url = EXCLUDED.image_url,
          status = EXCLUDED.status,
          locale = EXCLUDED.locale
      `, [blog.slug, blog.title, blog.excerpt, blog.content, blog.image_url, blog.status, blog.locale]);
      console.log(`Successfully upserted ${blog.slug}`);
    }
    console.log("Done!");
  } catch (err) {
    console.error("Error inserting blogs:", err);
  } finally {
    await pool.end();
  }
}

insertBlogs();
