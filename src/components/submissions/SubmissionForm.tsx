import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateFormDto } from "@/types/api";
import { createSubmission } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeftIcon, Loader2Icon, Send } from "lucide-react";

export function SubmissionForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateFormDto>({
    fullLegalName: "",
    isChildAbuseContent: false,
    removeChildAbuseContent: true,
    countryOfResidence: "Deutschland",
    CompanyName: "",
    CompanyYouRepresent: "",
    email: "",
    sendNoticeToAuthor: false,
    InfringingUrls: [""],
    isRelatedToMedia: false,
    QuestionOne: "",
    QuestionTwo: "",
    QuestionThree: "",
    confirmForm: false,
    signature: "",
  });

  const handleInputChange = (
    field: keyof CreateFormDto,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUrlChange = (index: number, value: string) => {
    const updatedUrls = [...formData.InfringingUrls];
    updatedUrls[index] = value;
    setFormData((prev) => ({
      ...prev,
      InfringingUrls: updatedUrls,
    }));
  };

  const addUrlField = () => {
    setFormData((prev) => ({
      ...prev,
      InfringingUrls: [...prev.InfringingUrls, ""],
    }));
  };

  const removeUrlField = (index: number) => {
    if (formData.InfringingUrls.length > 1) {
      const updatedUrls = [...formData.InfringingUrls];
      updatedUrls.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        InfringingUrls: updatedUrls,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.fullLegalName ||
      !formData.countryOfResidence ||
      !formData.CompanyName ||
      !formData.email ||
      !formData.InfringingUrls[0] ||
      !formData.QuestionOne ||
      !formData.QuestionTwo ||
      !formData.QuestionThree ||
      !formData.signature ||
      !formData.confirmForm
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createSubmission(formData);
      toast.success("Submission created successfully");
      navigate(`/submission/${response.id}`);
    } catch (error) {
      console.error("Failed to create submission:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create submission");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-0 animate-fade-in">
      <Card className="form-card shadow-lg px-2 md:px-4 py-2">
        <CardHeader className="px-2 md:px-4">
          <CardTitle>Create New Submission</CardTitle>
          <CardDescription>
            Fill out the form below to create a new submission.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-2 md:px-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullLegalName">Full Legal Name *</Label>
                <Input
                  id="fullLegalName"
                  value={formData.fullLegalName}
                  onChange={(e) =>
                    handleInputChange("fullLegalName", e.target.value)
                  }
                  placeholder="Enter your full legal name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="countryOfResidence">
                  Country of Residence *
                </Label>
                <Input
                  id="countryOfResidence"
                  disabled
                  value={formData.countryOfResidence}
                  onChange={(e) =>
                    handleInputChange("countryOfResidence", e.target.value)
                  }
                  placeholder="Enter your country of residence"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="CompanyName">Company Name *</Label>
                <Input
                  id="CompanyName"
                  value={formData.CompanyName}
                  onChange={(e) =>
                    handleInputChange("CompanyName", e.target.value)
                  }
                  placeholder="Enter your company name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="CompanyYouRepresent">
                  Company You Represent *
                </Label>
                <Input
                  id="CompanyYouRepresent"
                  value={formData.CompanyYouRepresent}
                  onChange={(e) =>
                    handleInputChange("CompanyYouRepresent", e.target.value)
                  }
                  placeholder="Enter the company you represent"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signature">Signature *</Label>
                <Input
                  id="signature"
                  value={formData.signature}
                  onChange={(e) =>
                    handleInputChange("signature", e.target.value)
                  }
                  placeholder="Enter your signature"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Infringing URLs *</Label>
                {formData.InfringingUrls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      placeholder="https://example.com"
                      required
                    />
                    {formData.InfringingUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeUrlField(index)}
                        className="flex-shrink-0"
                      >
                        -
                      </Button>
                    )}
                    {index === formData.InfringingUrls.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={addUrlField}
                        className="flex-shrink-0"
                      >
                        +
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isChildAbuseContent"
                  checked={formData.isChildAbuseContent}
                  onCheckedChange={(checked) =>
                    handleInputChange("isChildAbuseContent", !!checked)
                  }
                />
                <Label htmlFor="isChildAbuseContent">
                  Is Child Abuse Content
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="removeChildAbuseContent"
                  checked={formData.removeChildAbuseContent}
                  onCheckedChange={(checked) =>
                    handleInputChange("removeChildAbuseContent", !!checked)
                  }
                />
                <Label htmlFor="removeChildAbuseContent">
                  Remove Child Abuse Content Anonymously
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendNoticeToAuthor"
                  checked={formData.sendNoticeToAuthor}
                  onCheckedChange={(checked) =>
                    handleInputChange("sendNoticeToAuthor", !!checked)
                  }
                />
                <Label htmlFor="sendNoticeToAuthor">
                  Send Notice To Author
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRelatedToMedia"
                  checked={formData.isRelatedToMedia}
                  onCheckedChange={(checked) =>
                    handleInputChange("isRelatedToMedia", !!checked)
                  }
                />
                <Label htmlFor="isRelatedToMedia">Is Related To Media</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="QuestionOne">Question One *</Label>
                <Textarea
                  id="QuestionOne"
                  value={formData.QuestionOne}
                  onChange={(e) =>
                    handleInputChange("QuestionOne", e.target.value)
                  }
                  placeholder="Explain in detail why you believe the content on the above URL(s) is unlawful..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="QuestionTwo">Question Two *</Label>
                <Textarea
                  id="QuestionTwo"
                  value={formData.QuestionTwo}
                  onChange={(e) =>
                    handleInputChange("QuestionTwo", e.target.value)
                  }
                  placeholder="Quote the exact text from each URL above that you believe infringes on your rights..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="QuestionThree">Question Three *</Label>
                <Textarea
                  id="QuestionThree"
                  value={formData.QuestionThree}
                  onChange={(e) =>
                    handleInputChange("QuestionThree", e.target.value)
                  }
                  placeholder="Provide a detailed description of the infringing content..."
                  className="min-h-[100px]"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirmForm"
                  checked={formData.confirmForm}
                  onCheckedChange={(checked) =>
                    handleInputChange("confirmForm", !!checked)
                  }
                  required
                />
                <Label htmlFor="confirmForm" className="text-sm">
                  I swear, under penalty of perjury, that the information in
                  this notification is accurate and that I am authorized to
                  report this alleged violation. *
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/submissions")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.confirmForm}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
