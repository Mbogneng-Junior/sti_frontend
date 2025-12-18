// const LearnPage = () => {
//     return ( 
//         <div className="di">
//             Learn Page
//         </div>
//      );
// }
 
// export default LearnPage;



import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";


// Interface pour les props avec paramètres dynamiques
interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

// Données des cours (à synchroniser avec votre dashboard)
const COURSES_DATA: Record<string, { title: string; color: string; image: string }> = {
  "paludisme": { title: "Paludisme", color: "bg-green-500", image: "/paludisme.png" },
  "diabete": { title: "Diabète", color: "bg-blue-500", image: "/diabete.png" },
  "avc": { title: "AVC", color: "bg-red-500", image: "/avc.png" },
  "cancer-col": { title: "Cancer du Col", color: "bg-pink-500", image: "/cervical_cancer.png" },
};

export default async function LearnPage({ params }: PageProps) {
  // Dans Next.js 15+, params est une Promise
  const resolvedParams = await params;
  const courseId = resolvedParams.courseId;

  // Vérifier si le cours existe
  const courseData = COURSES_DATA[courseId];
  
  if (!courseData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-700 mb-2">Cours introuvable</h1>
          <p className="text-neutral-500 mb-4">Le cours "{courseId}" n'existe pas.</p>
          <Button asChild>
            <a href="/learn">Retour aux cours</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      
      {/* COLONNE DE DROITE (User progress) - Cachée sur mobile */}
      <div className="hidden lg:block w-[368px] sticky self-end bottom-6">
        <div className="min-h-[calc(100vh-48px)] sticky top-6 flex flex-col gap-y-4">
          <div className="border-2 rounded-xl p-4 flex flex-col gap-y-2">
            <h3 className="font-bold text-lg text-neutral-700">Mon statut</h3>
            <div className="flex items-center gap-x-2">
              <Image src={courseData.image} height={30} width={30} alt="Points" />
              <span className="font-bold text-neutral-600">0 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* COLONNE CENTRALE (Leçons) */}
      <div className="w-full lg:w-[600px] flex flex-col gap-y-12 mb-10">
        
        {/* Entête standard */}
        <h1 className="text-2xl font-bold text-neutral-700">Apprentissage</h1>

        {/* UNITÉ 1 */}
        <div>
          {/* Bannière de l'unité */}
          <div className={`${courseData.color} rounded-xl p-5 text-white flex items-center justify-between shadow-sm mb-6`}>
            <div className="flex flex-col gap-y-1">
              <h3 className="text-xl font-bold">Unité 1</h3>
              <p className="text-sm opacity-90">Comprendre le {courseData.title}</p>
            </div>
            <Button variant="secondary" size="lg">Continuer</Button>
          </div>

          {/* Chemin des leçons (Les ronds) */}
          <div className="flex flex-col items-center gap-y-4">
            
            {/* Leçon 1 */}
            <div className="relative">
              {/* Bulle info au dessus */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border-2 px-3 py-2 rounded-xl font-bold text-green-500 animate-bounce">
                START
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-white" />
              </div>

              {/* On enveloppe le cercle dans un Link */}
              <Link href={`/learn/${courseId}/lesson/1`}> 
                <div className={`h-[70px] w-[70px] rounded-full ${courseData.color} flex items-center justify-center cursor-pointer shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:brightness-110 active:shadow-none active:translate-y-[4px] transition-all`}>
                  <Image src={courseData.image} height={40} width={40} alt="Lesson" />
                </div>
              </Link>
            </div>

            {/* Leçon 2 (Verrouillée / Grise) */}
            <div className="pt-8">
              <div className="h-[70px] w-[70px] rounded-full bg-gray-200 flex items-center justify-center opacity-80 shadow-[0_4px_0_0_#e5e7eb]">
                <Image src="/Minimal_Geometric_Smirk_Face_Icon.png" height={40} width={40} alt="Locked" className="opacity-50 grayscale" />
              </div>
            </div>

            {/* Leçon 3 (Verrouillée) */}
            <div className="pt-8">
              <div className="h-[70px] w-[70px] rounded-full bg-gray-200 flex items-center justify-center opacity-80 shadow-[0_4px_0_0_#e5e7eb]">
                <Image src="/Minimal_Geometric_Smirk_Face_Icon.png" height={40} width={40} alt="Locked" className="opacity-50 grayscale" />
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}