import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  Leaf, 
  Droplets, 
  Clock, 
  AlertTriangle,
  Target,
  Coins,
  Sprout,
  Brain,
  CheckCircle,
  Info
} from "lucide-react";
import { generateCropRecommendations } from "@/services/cropRecommendationService";
import { toast } from "@/hooks/use-toast";

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
  suitabilityReason?: string;
  locationAdvantage?: string;
}

interface FarmerData {
  farmerName: string;
  landArea: string;
  pincode: string;
}

interface CropRecommendationsProps {
  isVisible: boolean;
  uploadedData?: { file: File; farmerData: FarmerData } | null;
}

const CropRecommendations = ({ isVisible, uploadedData }: CropRecommendationsProps) => {
  const [filterType, setFilterType] = useState<'roi' | 'cultivation'>('roi');
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [analysisNote, setAnalysisNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  useEffect(() => {
    if (isVisible && uploadedData && !hasAnalyzed) {
      analyzeAndGenerateRecommendations();
    }
  }, [isVisible, uploadedData, hasAnalyzed]);

  const analyzeAndGenerateRecommendations = async () => {
    if (!uploadedData) return;
    
    setIsLoading(true);
    try {
      const result = await generateCropRecommendations(
        uploadedData.file,
        uploadedData.farmerData
      );
      
      if (result.success) {
        setRecommendations(result.recommendations);
        setAnalysisNote(result.analysisNote);
        setHasAnalyzed(true);
        toast({
          title: "AI Analysis Complete",
          description: `Generated ${result.recommendations.length} personalized crop recommendations`,
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: result.analysisNote,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze soil data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
        <div className="text-center space-y-4">
          <Brain className="w-16 h-16 text-primary mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold">AI Analyzing Your Soil...</h2>
          <p className="text-muted-foreground">Processing soil composition and location data</p>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-soft">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-16" />
                  ))}
                </div>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0 && hasAnalyzed) {
    return (
      <div className="text-center p-8 bg-card rounded-lg shadow-soft">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Suitable Crops Found</h3>
        <p className="text-muted-foreground mb-4">
          Based on your soil analysis, we couldn't find optimal crop matches. Consider soil treatment first.
        </p>
        <Button onClick={() => setHasAnalyzed(false)} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const sortedRecommendations = [...recommendations].sort((a, b) => 
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
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">AI-Powered Crop Recommendations</h2>
        </div>
        <p className="text-muted-foreground">Based on your soil analysis and location</p>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Analysis Complete
        </Badge>
      </div>

      {analysisNote && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-line text-sm">
            {analysisNote}
          </AlertDescription>
        </Alert>
      )}

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
                <CardDescription className="space-y-1">
                  <p>
                    {filterType === 'roi' 
                      ? `High profitability crop with ${crop.profitability}% profit potential`
                      : `Easy to cultivate with ${crop.easeOfCultivation}% cultivation ease`
                    }
                  </p>
                  {crop.suitabilityReason && (
                    <p className="text-xs text-green-600 font-medium">
                      ✓ {crop.suitabilityReason}
                    </p>
                  )}
                  {crop.locationAdvantage && (
                    <p className="text-xs text-blue-600">
                      📍 {crop.locationAdvantage}
                    </p>
                  )}
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