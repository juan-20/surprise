import type { RequestEvent } from '@sveltejs/kit';

// Server-side load: fetch OG metadata for each link so page is fully SSR
export async function load({ fetch }: RequestEvent) {
  const links = [
    // add explicit `image` fields; when `image` is present we'll use it directly.
    { title: 'A melhor vida', url: "https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-osg_1_VIDEO", image: '' },
    { title: 'Quero te dar meu melhor', url: "https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-osg_7_VIDEO", image: '' },
    { title: 'É tempo de pregar', url: "https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-osg_9_VIDEO", image: '' },
    { title: 'Mantenha o passo', url: "https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-osg_17_VIDEO", image: '' },
    { title: 'O futuro que eu quero', url: "https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-osg_29_VIDEO", image: '' },
    { title: 'Agora é a hora', url: "https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-osg_42_VIDEO", image: '' },
    { title: 'Faça ajustes “pela causa das boas novas”', url: "https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-jwb_201805_8_VIDEO", image: 'https://media.discordapp.net/attachments/1445230985427025930/1446220109193679009/Untitled.jpg?ex=693330ef&is=6931df6f&hm=e60649cf9fac22f9704e606c34a3d3e07ea570a9599e354ea9ba7a108742f26e&=&format=webp' },
    { title: 'Eu amo o que eu faço para Jeová', url: "https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-jwb_201809_6_VIDEO", image: 'https://media.discordapp.net/attachments/1445230985427025930/1446220329751150603/Untitled.jpg?ex=69333124&is=6931dfa4&hm=52532e6f6f816b583fd7419a2b97471b47f283492d008c820652e11a7505f475&=&format=webp' },
    { title: 'Olga Mortlock: Jeová nos ajuda a pregar', url: "https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-jwb_201904_11_VIDEO", image: 'https://cdn.discordapp.com/attachments/1445230985427025930/1446220481014530109/Untitled.jpg?ex=69333148&is=6931dfc8&hm=0389f990906b5ef61ecf12de3a63368fdfd1c3e8fb746a20efe2d0a4e1f689e0' },
    { title: 'Takako e Hisako: Com a ajuda de Jeová, já somos pioneiras por 60 anos', url: "https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-jwb_201905_7_VIDEO", image: 'https://media.discordapp.net/attachments/1445230985427025930/1446220709742248048/Untitled.jpg?ex=6933317e&is=6931dffe&hm=ffee30f55eb36dc308b35bb5cd4c1e45cd6037e64aa5529349f3491634260a1f&=&format=webp' },
    { title: 'John Johansen: De pintor a pioneiro', url: 'https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-jwb_201910_9_VIDEO', image: 'https://cdn.discordapp.com/attachments/1445230985427025930/1446220975879491675/Untitled.jpg?ex=693331be&is=6931e03e&hm=882d1118df75d0a475b1f2b4d49457691b71d33505236bca214069a375440528&' },
    { title: 'Chang-Ryul Kim: Uma vida feliz no serviço de Jeová', url: 'https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-jwb_201911_11_VIDEO', image: 'https://cdn.discordapp.com/attachments/1445230985427025930/1446221100647186502/Untitled.jpg?ex=693331db&is=6931e05b&hm=63d5dbf76e2956c131628316ff04d1fa75b35272d41b6eaf32a9e8a1830dde4e&  ' },
    { title: 'Jovens — Encontrem paz por servir no tempo integral!', url: 'https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-jwbcov22_12_VIDEO', image: 'https://cdn.discordapp.com/attachments/1445230985427025930/1446221289579741194/Untitled.jpg?ex=69333208&is=6931e088&hm=84dfcd70d078c88ec50473c56d55737428e95192e1f58562aa0a787c69e9e006&' },
    { title: 'Use sua juventude para honrar a Jeová', url: 'https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-jwb_201703_7_VIDEO', image: 'https://cdn.discordapp.com/attachments/1445230985427025930/1446221396052021318/Untitled.jpg?ex=69333222&is=6931e0a2&hm=70531bc6b874900fbe0e448f166d3af573acc162fada3cd3bdf6e00ab9842a23&' },
    { title: 'Soldados corajosos de Cristo', url: 'https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-jwbcov_201805_9_VIDEO', image: 'https://media.discordapp.net/attachments/1445230985427025930/1446221506790293554/Untitled.jpg?ex=6933323c&is=6931e0bc&hm=6a2d3472a82c1dbb301ba36643b93e5b325ceeb2e3199d4c17eb74b5f5ffb0fb&=&format=webp' },
    { title: 'Três irmãs da Mongólia', url: 'https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-jwb_201711_7_VIDEO', image: 'https://media.discordapp.net/attachments/1445230985427025930/1446221803306483956/image.png?ex=69333283&is=6931e103&hm=55192fcd784ec761337a3a070e223dd894e781a619525d05b265528be964acae&=&format=webp&quality=lossless' },
    { title: 'Os pioneiros fortalecem a congregação', url: 'https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-jwb_201805_4_VIDEO', image: 'https://cdn.discordapp.com/attachments/1445230985427025930/1446222005711011931/Untitled.jpg?ex=693332b3&is=6931e133&hm=9c22bcdf0ddd266aa86e880713774cdfaaadf397b00e76f537d72e9520726536&' },
    { title: 'Qualidades que nos ajudam a não desistir', url: 'https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&lank=pub-jwbcov_201705_4_VIDEO', image: 'https://cdn.discordapp.com/attachments/1445230985427025930/1446222106714181786/Untitled.jpg?ex=693332cb&is=6931e14b&hm=ae4b49d86259eeba95ba799ef869137df8c05d817c64eee93b69aa7ef58c781d&' }
  ];

  const items: { title: string; url: string; image: string }[] = [];

  for (const link of links.filter((l) => l.url && l.url.trim().length > 0)) {
    // If an explicit image URL is provided in the array, use it and skip the OG fetch
    if (link.image && link.image.trim().length > 0) {
      items.push({ ...link, image: link.image, title: link.title });
      continue;
    }

    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(link.url)}`);
      if (res.ok) {
        const data = await res.json();
        const image = data.image ?? `https://image.thum.io/get/${encodeURIComponent(link.url)}`;
        const title = link.title; // ALWAYS use the title from the array as requested

        if (!data.image) {
          console.warn(`[og] no og:image for ${link.url}, using screenshot fallback`);
        }

        items.push({ ...link, image, title });
        continue;
      }

      console.error(`[og] /api/og returned ${res.status} for ${link.url}`);
    } catch (err) {
      console.error(`[og] fetch error for ${link.url}:`, err instanceof Error ? err.message : String(err));
    }

    // fallback if anything failed
    items.push({
      ...link,
      image: `https://image.thum.io/get/${encodeURIComponent(link.url)}`,
      title: link.title
    });
  }

  return { items };
}
