// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// export const Footer = () => {
//     return (
//         <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
//             <div className=" max-w-5xl mx-auto flex items-center justify-evenly h-full">
//                 <Button>
//                     <Image 
//                         src="/paludisme.png" 
//                         alt="Paludisme Logo" 
//                         height={32} 
//                         width={40}
//                         className="mr-4 rounded-md" 
//                     />
//                     Paludisme
//                 </Button>
//                 <Button>
//                     <Image 
//                         src="/avc.png" 
//                         alt="AVC Logo" 
//                         height={32} 
//                         width={40}
//                         className="mr-4 rounded-md" 
//                     />
//                     AVC
//                 </Button>
//                 <Button>
//                     <Image 
//                         src="/cervical_cancer.png" 
//                         alt="Cervical Cancer Logo" 
//                         height={32} 
//                         width={40}
//                         className="mr-4 rounded-md" 
//                     />
//                     Cervical Cancer
//                 </Button>
//                 <Button>
//                     <Image 
//                         src="/diabete.png" 
//                         alt="Diabete Logo" 
//                         height={32} 
//                         width={40}
//                         className="mr-4 rounded-md" 
//                     />
//                     Diabete
//                 </Button>

//             </div>
//         </footer>
//       );
// }
 


import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
    return (
        // On garde le hidden lg:block car sur mobile, on préfère souvent 
        // ne pas encombrer le bas de l'écran avec trop de boutons.
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2 bg-white">
            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                
                {/* Bouton Paludisme */}
                <Button size="lg" variant="ghost" className="w-full hover:bg-slate-100 transition">
                    <Image 
                        src="/paludisme.png" 
                        alt="Paludisme" 
                        height={32} 
                        width={40}
                        className="mr-4 rounded-md object-contain" 
                    />
                    <span className="font-bold text-slate-600">Paludisme</span>
                </Button>

                {/* Bouton AVC */}
                <Button size="lg" variant="ghost" className="w-full hover:bg-slate-100 transition">
                    <Image 
                        src="/avc.png" 
                        alt="AVC" 
                        height={32} 
                        width={40}
                        className="mr-4 rounded-md object-contain" 
                    />
                    <span className="font-bold text-slate-600">AVC</span>
                </Button>

                {/* Bouton Cancer du col */}
                <Button size="lg" variant="ghost" className="w-full hover:bg-slate-100 transition">
                    <Image 
                        src="/cervical_cancer.png" 
                        alt="Cancer" 
                        height={32} 
                        width={40}
                        className="mr-4 rounded-md object-contain" 
                    />
                    <span className="font-bold text-slate-600">Cancer Col</span>
                </Button>

                {/* Bouton Diabète */}
                <Button size="lg" variant="ghost" className="w-full hover:bg-slate-100 transition">
                    <Image 
                        src="/diabete.png" 
                        alt="Diabète" 
                        height={32} 
                        width={40}
                        className="mr-4 rounded-md object-contain" 
                    />
                    <span className="font-bold text-slate-600">Diabète</span>
                </Button>

            </div>
        </footer>
    );
}