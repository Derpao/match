import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import ClientFormWrapper from './ClientFormWrapper';
import { formatMatchTime } from '@/lib/utils';
import { Match } from '@/lib/types';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getMatch(id: string): Promise<Match | undefined> {
  try {
    // Add artificial delay in development to see loading state
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    
    const res = await fetch(`${protocol}://${host}/api/matches`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', errorText);
      throw new Error('Failed to fetch matches');
    }

    const { data } = await res.json();
    return Array.isArray(data) ? data.find((m: Match) => m.id === Number(id)) : undefined;
  } catch (error) {
    console.error('Error fetching match:', error);
    return undefined;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatch(id);
  return {
    title: match
      ? `${match.teams.teamA} VS ${match.teams.teamB} - Football Prediction`
      : 'Match Not Found - Football Prediction',
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const match = await getMatch(id);

  if (!match) {
    notFound();
  }

  return (
    <div className="w-full">
      <div className="mb-4 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
        <div className="relative h-[200px]">
          <Image 
            src={match.image} 
            alt={`${match.teams.teamA} vs ${match.teams.teamB}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 bg-white rounded-full p-2 mb-2">
                <Image
                  src={match.teams.logoA}
                  alt={match.teams.teamA}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <h2 className="text-lg font-bold text-white">{match.teams.teamA}</h2>
            </div>
            
            <span className="text-2xl font-bold text-blue-200">VS</span>
            
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 bg-white rounded-full p-2 mb-2">
                <Image
                  src={match.teams.logoB}
                  alt={match.teams.teamB}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <h2 className="text-lg font-bold text-white">{match.teams.teamB}</h2>
            </div>
          </div>
          <p className="text-center text-blue-100 mt-2 text-sm">
            เวลาแข่ง: {formatMatchTime(match.matchTime)}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <ClientFormWrapper
          matchId={match.id}
          teamNames={{
            teamA: match.teams.teamA,
            teamB: match.teams.teamB,
          }}
          matchTime={match.matchTime}
        />
      </div>
    </div>
  );
}