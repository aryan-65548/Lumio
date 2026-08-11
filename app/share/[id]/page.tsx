import Link from 'next/link';

interface SharePageProps {
  params: Promise<{ id: string }>;
}

interface ShareData {
  img: string;
  name: string;
  role: string;
  title: string;
}

// Helper to decode the base64 parameter safely
function decodeShareId(id: string): ShareData | null {
  try {
    const decoded = Buffer.from(decodeURIComponent(id), 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    if (parsed.img && parsed.name) {
      return parsed as ShareData;
    }
    return null;
  } catch (error) {
    console.error('Failed to decode share ID:', error);
    return null;
  }
}

// Generate dynamic metadata for Twitter Cards & Open Graph scraping
export async function generateMetadata(
  { params }: SharePageProps
): Promise<Metadata> {
  const { id } = await params;
  const data = decodeShareId(id);

  if (!data) {
    return {
      title: 'HackerHouse Goa 2026',
      description: 'Join us at HackerHouse Goa 2026!',
    };
  }

  const title = `${data.name} | ${data.title} @ HackerHouse Goa 2026`;
  const description = `Check out my HackerHouse Goa 2026 Builder Card! Role: ${data.role}. Create yours now!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: data.img,
          width: 1080,
          height: 1350,
          alt: `${data.name}'s Builder Card`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [data.img],
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const data = decodeShareId(id);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-4">
        <h1 className="font-serif font-black text-3xl text-[#083C26] mb-4">INVALID LINK</h1>
        <Link 
          href="/" 
          className="px-6 py-3 bg-[#083C26] text-[#FFE566] font-bold rounded-lg border-2 border-[#083C26] hover:bg-[#FFE566] hover:text-[#083C26] transition-all"
        >
          GO TO GENERATOR
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#083C26] flex flex-col items-center justify-center p-6 noise-bg">
      <div className="max-w-md w-full bg-[#FFFDF9] border-4 border-[#083C26] shadow-[8px_8px_0px_0px_#083C26] p-6 rounded-2xl flex flex-col items-center relative z-20">
        
        {/* Visual Brand Header */}
        <div className="text-center mb-6">
          <h2 className="font-serif font-black text-2xl tracking-tight leading-none uppercase">HACKER HOUSE</h2>
          <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#00A3E0]">GOA 2026</span>
        </div>

        {/* Card Render */}
        <div className="relative w-full aspect-[4/5] border-4 border-[#083C26] rounded-xl overflow-hidden shadow-md mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={data.img} 
            alt={`${data.name}'s HackerHouse Card`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Builder identity badge */}
        <div className="text-center mb-6">
          <span className="px-3 py-1 bg-[#FFE566] border-2 border-[#083C26] rounded-md font-bold text-xs uppercase">
            {data.title}
          </span>
          <h1 className="font-serif font-black text-3xl tracking-tight uppercase mt-3 leading-none">
            {data.name}
          </h1>
          <p className="font-sans font-semibold text-sm italic text-[#FF2E93] mt-1">
            {data.role}
          </p>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-3">
          <Link 
            href="/"
            className="w-full text-center py-3 bg-[#083C26] text-[#FFE566] font-bold rounded-xl border-2 border-[#083C26] hover:bg-[#FFE566] hover:text-[#083C26] transform hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md"
          >
            CREATE YOUR BUILDER CARD
          </Link>
        </div>
      </div>

      {/* Decorative Beach Accents for Goa look */}
      <div className="absolute bottom-4 right-4 text-xs opacity-40 font-mono hidden md:block">
        HHG2026 // PFP_GEN
      </div>
    </div>
  );
}
