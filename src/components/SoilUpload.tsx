import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, FileText, Image, CheckCircle, User, MapPin, Crop } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  farmerName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  landArea: z.string().trim().min(1, "Land area is required").regex(/^\d+(\.\d+)?$/, "Please enter a valid number"),
  pincode: z.string().trim().length(6, "Pincode must be exactly 6 digits").regex(/^\d{6}$/, "Please enter a valid pincode"),
});

type FormData = z.infer<typeof formSchema>;

interface SoilUploadProps {
  onUploadComplete: (data: { file: File; farmerData: FormData }) => void;
}

const SoilUpload = ({ onUploadComplete }: SoilUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      farmerName: "",
      landArea: "",
      pincode: "",
    },
  });

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
    toast({
      title: "File uploaded successfully",
      description: "Please complete the form and submit for analysis",
    });
  };

  const onSubmit = (data: FormData) => {
    if (!uploadedFile) {
      toast({
        title: "No file uploaded",
        description: "Please upload a soil report first",
        variant: "destructive",
      });
      return;
    }

    onUploadComplete({ file: uploadedFile, farmerData: data });
    setIsSubmitted(true);
    toast({
      title: "Analysis started",
      description: "Analyzing your soil report and location data...",
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

  if (isSubmitted) {
    return (
      <Card className="shadow-medium">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-green-700">Analysis Complete!</h3>
          <p className="text-muted-foreground">Your soil report and location data have been processed successfully.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-medium">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center gap-2 justify-center">
            <User className="w-6 h-6 text-primary" />
            Farmer Details
          </CardTitle>
          <CardDescription>
            Provide your details for personalized crop recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="farmerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Farmer Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="landArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Crop className="w-4 h-4" />
                      Land Area (in acres)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter land area in acres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Pincode
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter 6-digit pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Card className="shadow-medium">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center gap-2 justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                    Upload Soil Report
                  </CardTitle>
                  <CardDescription>
                    Upload your soil analysis report (PDF or image)
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
                        type="button"
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

              <Button 
                type="submit" 
                className="w-full" 
                disabled={!uploadedFile}
              >
                <FileText className="w-4 h-4 mr-2" />
                Analyze Soil & Get Recommendations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoilUpload;