import { useState } from "react";
import { Download, Trash2, Eye, Calendar, FileText, User, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DataTable from "@/components/common/DataTable";
import { usePrescriptions } from "@/hooks/usePrescriptions";
import { formatDate } from "@/utils/formatDate";

const PrescriptionList = () => {
  const { data: prescriptions = [], isLoading } = usePrescriptions();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'processed':
        return <Badge variant="default">Processed</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    {
      key: "file_name" as const,
      header: "File Name",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "patient_name" as const,
      header: "Patient",
      render: (value: string) => value ? (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          {value}
        </div>
      ) : "—",
    },
    {
      key: "doctor_name" as const,
      header: "Doctor",
      render: (value: string) => value ? (
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-muted-foreground" />
          {value}
        </div>
      ) : "—",
    },
    {
      key: "status" as const,
      header: "Status",
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "created_at" as const,
      header: "Uploaded",
      render: (value: string) => formatDate(value),
    },
    {
      key: "actions" as const,
      header: "Actions",
      render: (value: any, prescription: any) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            title="View prescription"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                title="Delete prescription"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Prescription</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this prescription? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => console.log('Delete prescription:', prescription.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading prescriptions...</div>
        </CardContent>
      </Card>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">No prescriptions found</h3>
          <p className="text-muted-foreground text-sm">
            Upload your first prescription above to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Prescription Records ({prescriptions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable data={prescriptions} columns={columns} />
      </CardContent>
    </Card>
  );
};

export default PrescriptionList;