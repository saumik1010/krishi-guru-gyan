import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Image, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SoilUploadProps {
  onUploadComplete: (file: File) => void;
}

const SoilUpload = ({ onUploadComplete }: SoilUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file (JPG, PNG)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    onUploadComplete(file);
    toast({
      title: "File uploaded successfully",
      description: "Analyzing your soil report...",
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <Card className="shadow-medium">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center gap-2 justify-center">
          <FileText className="w-6 h-6 text-primary" />
          Upload Soil Report
        </CardTitle>
        <CardDescription>
          Upload your soil analysis report (PDF or image) to get crop recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            isDragOver 
              ? 'border-primary bg-accent/50' 
              : uploadedFile 
                ? 'border-green-500 bg-green-50' 
                : 'border-border hover:border-primary/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          {uploadedFile ? (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <p className="font-semibold text-green-700">File uploaded successfully!</p>
                <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <div className="space-y-2">
                <p className="font-semibold">Drop your soil report here</p>
                <p className="text-sm text-muted-foreground">or click to browse files</p>
                <p className="text-xs text-muted-foreground">Supports PDF, JPG, PNG (max 10MB)</p>
              </div>
            </>
          )}
          
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
            id="soil-upload"
          />
          <label htmlFor="soil-upload">
            <Button 
              variant="outline" 
              className="mt-4 cursor-pointer"
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Select File
              </span>
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilUpload;