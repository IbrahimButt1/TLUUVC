import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

// This is mock data. We'll replace this with a database later.
const services = [
    {
      title: "Student Visas",
      description: "Comprehensive guidance for students aspiring to study abroad, from application to approval."
    },
    {
      title: "Work Visas",
      description: "Tailored support for professionals seeking employment opportunities in a new country."
    },
    {
      title: "Family & Partner Visas",
      description: "Helping you reunite with your loved ones through dedicated family and partner visa services."
    },
    {
      title: "Application Review",
      description: "Meticulous review of your visa application to maximize your chances of success."
    }
  ];

export default function ManageServices() {
  return (
    <div>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Manage Services</h1>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Service
            </Button>
        </div>

        <Card>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.title}>
                                <TableCell className="font-medium">{service.title}</TableCell>
                                <TableCell>{service.description}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                                    <Button variant="destructive" size="sm">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
