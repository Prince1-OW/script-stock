import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useCreatePrescription } from "@/hooks/usePrescriptions";

interface PrescriptionFormProps {
  fileName?: string;
  filePath?: string;
  onSuccess?: () => void;
}

const PrescriptionForm = ({ fileName, filePath, onSuccess }: PrescriptionFormProps) => {
  const [open, setOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("pending");
  
  const createPrescription = useCreatePrescription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileName || !filePath) {
      return;
    }

    try {
      await createPrescription.mutateAsync({
        file_name: fileName,
        file_path: filePath,
        patient_name: patientName || undefined,
        doctor_name: doctorName || undefined,
        notes: notes || undefined,
      });
      
      // Reset form
      setPatientName("");
      setDoctorName("");
      setNotes("");
      setStatus("pending");
      setOpen(false);
      
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save prescription:", error);
    }
  };

  if (!fileName || !filePath) {
    return (
      <Button disabled variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Details
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Prescription Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fileName">File Name</Label>
            <Input 
              id="fileName"
              value={fileName} 
              disabled 
              className="bg-muted"
            />
          </div>
          
          <div>
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name"
            />
          </div>
          
          <div>
            <Label htmlFor="doctorName">Doctor Name</Label>
            <Input
              id="doctorName"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="Enter prescribing doctor"
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about the prescription"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={createPrescription.isPending}
              className="flex-1"
            >
              {createPrescription.isPending ? "Saving..." : "Save Prescription"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionForm;