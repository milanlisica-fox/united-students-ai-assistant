import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const AIAssistant = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors whitespace-nowrap w-[28.8rem]"
      >
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium">AI Real Estate Assistant</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Real Estate Assistant
            </DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p className="text-muted-foreground mb-3">
              Hello! I'm your AI assistant. I can help you find the perfect accommodation based on your preferences.
            </p>
            <div className="space-y-2">
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">What I can help with:</p>
                <ul className="text-sm text-muted-foreground space-y-0.5 ml-4 list-disc">
                  <li>Finding accommodations in your budget</li>
                  <li>Filtering by amenities and location</li>
                  <li>Comparing different properties</li>
                  <li>Answering questions about listings</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setOpen(false)}>
              Get Started
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIAssistant;
