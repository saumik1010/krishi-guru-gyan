import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Leaf, 
  Droplets, 
  Clock, 
  AlertTriangle,
  Target,
  Coins,
  Sprout
} from "lucide-react";

interface CropRecommendation {
  name: string;
  profitability: number;
  easeOfCultivation: number;
  waterRequirement: 'Low' | 'Medium' | 'High';
  harvestTime: string;
  marketPrice: string;
  advantages: string[];
  risks: string[];
  fertilizers: string[];
}

const mockRecommendations: CropRecommendation[] = [
  {
    name: "Tomatoes",
    profitability: 85,
    easeOfCultivation: 65,
    waterRequirement: 'Medium',
    harvestTime: "75-90 days",
    marketPrice: "₹20-30/kg",
    advantages: ["High market demand", "Multiple harvests possible", "Good profit margins"],
    risks: ["Pest susceptible", "Weather dependent", "Storage challenges"],
    fertilizers: ["NPK 19:19:19", "Calcium supplements", "Organic compost"]
  },
  {
    name: "Maize",
    profitability: 70,
    easeOfCultivation: 90,
    waterRequirement: 'Medium',
    harvestTime: "100-120 days",
    marketPrice: "₹15-20/kg",
    advantages: ["Easy to grow", "Drought tolerant", "Multiple uses"],
    risks: ["Bird damage", "Storage pests", "Price fluctuation"],
    fertilizers: ["Urea", "DAP", "Potash"]
  },
  {
    name: "Wheat",
    profitability: 60,
    easeOfCultivation: 95,
    waterRequirement: 'Low',
    harvestTime: "120-150 days",
    marketPrice: "₹18-25/kg",
    advantages: ["Stable market", "Government support", "Low maintenance"],
    risks: ["Disease susceptible", "Weather dependent harvesting"],
    fertilizers: ["NPK 12:32:16", "Zinc sulfate", "Organic manure"]
  }
];

interface CropRecommendationsProps {
  isVisible: boolean;
}

const CropRecommendations = ({ isVisible }: CropRecommendationsProps) => {
  const [filterType, setFilterType] = useState<'roi' | 'cultivation'>('roi');

  if (!isVisible) return null;

  const sortedRecommendations = [...mockRecommendations].sort((a, b) => 
    filterType === 'roi' 
      ? b.profitability - a.profitability 
      : b.easeOfCultivation - a.easeOfCultivation
  );

  const getWaterColor = (requirement: string) => {
    switch (requirement) {
      case 'Low': return 'text-blue-400';
      case 'Medium': return 'text-blue-600'; 
      case 'High': return 'text-blue-800';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Crop Recommendations</h2>
        <p className="text-muted-foreground">Based on your soil analysis</p>
      </div>

      <Tabs value={filterType} onValueChange={(value) => setFilterType(value as 'roi' | 'cultivation')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roi" className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            High ROI
          </TabsTrigger>
          <TabsTrigger value="cultivation" className="flex items-center gap-2">
            <Sprout className="w-4 h-4" />
            Easy Cultivation
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filterType} className="space-y-4">
          {sortedRecommendations.map((crop, index) => (
            <Card key={crop.name} className="shadow-soft hover:shadow-medium transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    {crop.name}
                    {index === 0 && (
                      <Badge variant="secondary" className="bg-gradient-harvest text-white">
                        Recommended
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Market Price</p>
                    <p className="font-semibold text-primary">{crop.marketPrice}</p>
                  </div>
                </div>
                <CardDescription>
                  {filterType === 'roi' 
                    ? `High profitability crop with ${crop.profitability}% profit potential`
                    : `Easy to cultivate with ${crop.easeOfCultivation}% cultivation ease`
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <TrendingUp className="w-6 h-6 text-roi mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Profitability</p>
                    <p className="font-semibold">{crop.profitability}%</p>
                  </div>
                  
                  <div className="text-center">
                    <Leaf className="w-6 h-6 text-cultivation mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Ease</p>
                    <p className="font-semibold">{crop.easeOfCultivation}%</p>
                  </div>
                  
                  <div className="text-center">
                    <Droplets className={`w-6 h-6 ${getWaterColor(crop.waterRequirement)} mx-auto mb-1`} />
                    <p className="text-sm text-muted-foreground">Water Need</p>
                    <p className="font-semibold">{crop.waterRequirement}</p>
                  </div>
                  
                  <div className="text-center">
                    <Clock className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Harvest</p>
                    <p className="font-semibold">{crop.harvestTime}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Advantages
                    </h4>
                    <ul className="text-sm space-y-1">
                      {crop.advantages.map((advantage, idx) => (
                        <li key={idx} className="text-muted-foreground">• {advantage}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Risks
                    </h4>
                    <ul className="text-sm space-y-1">
                      {crop.risks.map((risk, idx) => (
                        <li key={idx} className="text-muted-foreground">• {risk}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-1">
                      <Leaf className="w-4 h-4" />
                      Fertilizers
                    </h4>
                    <ul className="text-sm space-y-1">
                      {crop.fertilizers.map((fertilizer, idx) => (
                        <li key={idx} className="text-muted-foreground">• {fertilizer}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CropRecommendations;