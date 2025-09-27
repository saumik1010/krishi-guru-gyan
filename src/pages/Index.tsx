import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, Bug, Home } from "lucide-react";
import Header from "@/components/Header";
import SoilUpload from "@/components/SoilUpload";
import CropRecommendations from "@/components/CropRecommendations";
import TaskManagement from "@/components/TaskManagement";
import PestDetection from "@/components/PestDetection";

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [soilReportUploaded, setSoilReportUploaded] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<{ file: File; farmerData: any } | null>(null);

  const handleSoilUploadComplete = (data: { file: File; farmerData: any }) => {
    setSoilReportUploaded(true);
    setUploadedData(data);
    // Auto-switch to recommendations tab after upload
    setTimeout(() => {
      setActiveTab("recommendations");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Smart Agricultural Advisory</h2>
            <p className="text-muted-foreground text-lg">
              Upload your soil report, get crop recommendations, and manage your farming activities
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Soil Analysis</span>
              </TabsTrigger>
              <TabsTrigger 
                value="recommendations" 
                className="flex items-center gap-2"
                disabled={!soilReportUploaded}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Crops</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="pest" className="flex items-center gap-2">
                <Bug className="w-4 h-4" />
                <span className="hidden sm:inline">Pest Control</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <SoilUpload onUploadComplete={handleSoilUploadComplete} />
              
              {!soilReportUploaded && (
                <div className="text-center p-8 bg-card rounded-lg shadow-soft">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Get Started</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your soil analysis report to receive personalized crop recommendations
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Accepts PDF and image formats</li>
                    <li>• AI-powered soil analysis</li>
                    <li>• Instant crop recommendations</li>
                    <li>• ROI and cultivation ease filters</li>
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommendations">
              <CropRecommendations isVisible={soilReportUploaded} uploadedData={uploadedData} />
              {!soilReportUploaded && (
                <div className="text-center p-8 bg-card rounded-lg shadow-soft">
                  <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Upload Soil Report First</h3>
                  <p className="text-muted-foreground mb-4">
                    Please upload your soil analysis report to get crop recommendations
                  </p>
                  <Button onClick={() => setActiveTab("upload")}>
                    <FileText className="w-4 h-4 mr-2" />
                    Go to Upload
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tasks">
              <TaskManagement isVisible={true} />
            </TabsContent>

            <TabsContent value="pest">
              <PestDetection isVisible={true} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
