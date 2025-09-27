import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Camera, 
  Upload, 
  Bug, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Leaf
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PestDetectionResult {
  pestName: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  treatment: string[];
  prevention: string[];
}

const mockPestResult: PestDetectionResult = {
  pestName: "Aphids",
  confidence: 87,
  severity: 'Medium',
  description: "Small green insects found on leaf undersides, causing yellowing and curling",
  treatment: [
    "Spray neem oil solution (2ml per liter)",
    "Use insecticidal soap spray",
    "Release ladybugs as biological control"
  ],
  prevention: [
    "Regular monitoring of plants",
    "Maintain proper plant spacing",
    "Remove weeds around crop area"
  ]
};

interface PestDetectionProps {
  isVisible: boolean;
}

const PestDetection = ({ isVisible }: PestDetectionProps) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PestDetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isVisible) return null;

  const handleImageUpload = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG)",
        variant: "destructive",
      });
      return;
    }

    setUploadedImage(file);
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult(mockPestResult);
      setIsAnalyzing(false);
      toast({
        title: "Analysis complete",
        description: "Pest detected with treatment recommendations",
      });
    }, 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Low': return <CheckCircle className="w-4 h-4" />;
      case 'Medium': return <AlertTriangle className="w-4 h-4" />;
      case 'High': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bug className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2 justify-center">
          <Bug className="w-6 h-6 text-primary" />
          Pest Detection
        </h2>
        <p className="text-muted-foreground">Upload crop images to detect pests and get treatment recommendations</p>
      </div>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Upload Crop Image
          </CardTitle>
          <CardDescription>
            Take a clear photo of affected plant parts for accurate pest identification
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            {uploadedImage ? (
              <div className="space-y-4">
                <img 
                  src={URL.createObjectURL(uploadedImage)} 
                  alt="Uploaded crop" 
                  className="max-w-xs max-h-48 mx-auto rounded-lg shadow-soft"
                />
                <p className="font-semibold text-green-700">Image uploaded successfully!</p>
                <p className="text-sm text-muted-foreground">{uploadedImage.name}</p>
              </div>
            ) : (
              <>
                <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="font-semibold">Upload crop image for analysis</p>
                  <p className="text-sm text-muted-foreground">JPG, PNG files up to 10MB</p>
                </div>
              </>
            )}
            
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
              id="pest-upload"
            />
            <label htmlFor="pest-upload">
              <Button 
                variant="outline" 
                className="mt-4 cursor-pointer"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadedImage ? 'Change Image' : 'Select Image'}
                </span>
              </Button>
            </label>
          </div>

          {isAnalyzing && (
            <Alert className="mt-4">
              <Leaf className="w-4 h-4 animate-pulse" />
              <AlertDescription>
                Analyzing image for pest detection... This may take a few moments.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analysisResult && !isAnalyzing && (
        <Card className="shadow-medium border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-orange-600" />
                Pest Identified: {analysisResult.pestName}
              </span>
              <div className="flex items-center gap-2">
                <Badge className={getSeverityColor(analysisResult.severity)}>
                  {getSeverityIcon(analysisResult.severity)}
                  {analysisResult.severity} Risk
                </Badge>
                <Badge variant="outline">
                  {analysisResult.confidence}% confidence
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              {analysisResult.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Immediate Treatment
                </h4>
                <ul className="space-y-2">
                  {analysisResult.treatment.map((treatment, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{treatment}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Prevention Tips
                </h4>
                <ul className="space-y-2">
                  {analysisResult.prevention.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <strong>Important:</strong> Always read pesticide labels carefully and follow safety guidelines. 
                Consider organic alternatives first and consult with local agricultural experts for severe infestations.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PestDetection;