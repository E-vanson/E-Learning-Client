import {
    Card,
    CardContent,    
} from "@elearning/ui";

export function VideosGrid() {
  // Array of YouTube video IDs
  const videos = [
    "b0XI-cbel1U", 
    "b0XI-cbel1U",
    "b0XI-cbel1U"
  ];

  return (
    <div className="container py-3 lg:py-5">       
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {videos.map((videoId, index) => (
          <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-0 relative">
              <div className="aspect-w-16 aspect-h-9 relative">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="w-full h-full"
                  title={`YouTube video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>              
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}