import {
    Card,
    CardContent,
    CardFooter,
    Separator,
} from "@elearning/ui";
import Image from "next/image";
type Partner = {
  imgPath: any;
};


const PARTNER_IMAGES = {
  'org1': require('@elearning/assets/images/org1.png'),
  'org2': require('@elearning/assets/images/org2.png'),
    'org3': require('@elearning/assets/images/org3.png'),
  'org4': require('@elearning/assets/images/org4.png')
};


const partners: Partner[] = [
  {
    imgPath: 'org1'
    
  },
  {
    imgPath: 'org2'
    
  },
  {
    imgPath: 'org3'
    
  },
  {
    imgPath: 'org4'
    
  }
];

export function PartnersGrid() {
  return (
    <div className="container py-3 lg:py-5">       
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
        
        {partners.map((partner, index) => (
          <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow hover:bg-teal-50p">
            <CardContent className="p-0 relative">
                    <div className="aspect-w-16 aspect-h-9 relative">
                        <Image
                            src={PARTNER_IMAGES[partner.imgPath as keyof typeof PARTNER_IMAGES]}
                            className="bg-primary object-cover"
                            alt="Image"
                            priority
                            fill
                            sizes="33vh"
                        />
              </div>              
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}