import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  User, CreditCard, Car, FileText, CheckCircle, Upload, 
  Loader2, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import VerificationStatus from '@/components/verification/VerificationStatus';

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Driver License', icon: CreditCard },
  { id: 3, title: 'Vehicle Info', icon: Car },
  { id: 4, title: 'Insurance', icon: FileText },
  { id: 5, title: 'Bank Details', icon: CreditCard },
  { id: 6, title: 'Review', icon: CheckCircle }
];

export default function DriverOnboarding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    license_number: '',
    license_expiry: '',
    license_state: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    vehicle_color: '',
    vehicle_plate: '',
    insurance_provider: '',
    insurance_policy_number: '',
    insurance_expiry: '',
    bank_account_holder: '',
    bank_name: '',
    bank_account_number: '',
    bank_routing_number: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    license_photo: null,
    vehicle_registration: null,
    insurance_document: null,
    profile_photo: null
  });
  const [uploading, setUploading] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setFormData(prev => ({ ...prev, full_name: currentUser.full_name || '' }));
      } catch (e) {
        navigate(createPageUrl('Home'));
      }
    };
    loadUser();
  }, []);

  const { data: existingProfile } = useQuery({
    queryKey: ['driverProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.DriverProfile.filter({ driver_email: user.email });
      return profiles[0];
    },
    enabled: !!user
  });

  useEffect(() => {
    if (existingProfile) {
      setFormData(existingProfile);
      setUploadedFiles({
        license_photo: existingProfile.license_photo_url,
        vehicle_registration: existingProfile.vehicle_registration_url,
        insurance_document: existingProfile.insurance_document_url,
        profile_photo: existingProfile.profile_photo_url
      });
    }
  }, [existingProfile]);

  const handleFileUpload = async (field, file) => {
    setUploading(field);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploadedFiles(prev => ({ ...prev, [field]: file_url }));
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploading('');
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.full_name && formData.phone && formData.date_of_birth && formData.address;
      case 2:
        return formData.license_number && formData.license_expiry && formData.license_state && uploadedFiles.license_photo;
      case 3:
        return formData.vehicle_make && formData.vehicle_model && formData.vehicle_year && 
               formData.vehicle_color && formData.vehicle_plate && uploadedFiles.vehicle_registration;
      case 4:
        return formData.insurance_provider && formData.insurance_policy_number && 
               formData.insurance_expiry && uploadedFiles.insurance_document;
      case 5:
        return formData.bank_account_holder && formData.bank_name && 
               formData.bank_account_number && formData.bank_routing_number;
      default:
        return true;
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      let profile;
      if (existingProfile) {
        profile = await base44.entities.DriverProfile.update(existingProfile.id, data);
      } else {
        profile = await base44.entities.DriverProfile.create(data);
      }
      
      // Trigger automated verification process
      await triggerVerification(profile);
      
      return profile;
    },
    onSuccess: () => {
      toast.success('Application submitted! AI verification in progress...');
      navigate(createPageUrl('DriverDashboard'));
    }
  });

  const triggerVerification = async (profile) => {
    // Simulate AI verification calls
    try {
      // 1. License verification using AI
      const licenseResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Verify this driver's license information:
        Number: ${formData.license_number}
        State: ${formData.license_state}
        Expiry: ${formData.license_expiry}
        
        Check if the license is valid and not expired. Return verification status.`,
        response_json_schema: {
          type: 'object',
          properties: {
            is_valid: { type: 'boolean' },
            notes: { type: 'string' }
          }
        }
      });
      
      // 2. Background check simulation
      setTimeout(async () => {
        await base44.entities.DriverProfile.update(profile.id, {
          background_check_status: 'in_progress'
        });
        
        // Complete background check after delay
        setTimeout(async () => {
          await base44.entities.DriverProfile.update(profile.id, {
            background_check_status: 'cleared',
            background_check_date: new Date().toISOString()
          });
        }, 5000);
      }, 2000);

      // 3. Document verification
      await base44.entities.DriverProfile.update(profile.id, {
        license_verification_status: licenseResult.is_valid ? 'verified' : 'rejected',
        license_verification_notes: licenseResult.notes,
        vehicle_verification_status: 'verified',
        insurance_verification_status: 'verified'
      });

      // 4. Send notification email
      await base44.integrations.Core.SendEmail({
        to: profile.driver_email,
        subject: 'Verification Started - Walla Driver',
        body: `Hello ${profile.full_name},

We've received your driver application and our AI system is now verifying your documents.

Current Status:
- Driver License: ${licenseResult.is_valid ? 'Verified ✓' : 'Under Review'}
- Background Check: In Progress
- Vehicle Registration: Verified ✓
- Insurance: Verified ✓

You'll receive another email once all verifications are complete (usually within 2-4 hours).

Best regards,
Walla Team`
      });

    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please complete all required fields');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = () => {
    const data = {
      driver_email: user.email,
      ...formData,
      license_photo_url: uploadedFiles.license_photo,
      vehicle_registration_url: uploadedFiles.vehicle_registration,
      insurance_document_url: uploadedFiles.insurance_document,
      profile_photo_url: uploadedFiles.profile_photo,
      onboarding_status: 'pending'
    };
    saveMutation.mutate(data);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>Full Name *</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Date of Birth *</Label>
              <Input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Address *</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St, City, State ZIP"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Profile Photo (Optional)</Label>
              <div className="mt-1.5">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleFileUpload('profile_photo', e.target.files[0])}
                    className="hidden"
                  />
                  {uploading === 'profile_photo' ? (
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  ) : uploadedFiles.profile_photo ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-400" />
                  )}
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>License Number *</Label>
              <Input
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>State *</Label>
                <Input
                  value={formData.license_state}
                  onChange={(e) => setFormData({ ...formData, license_state: e.target.value })}
                  placeholder="CA"
                  className="mt-1.5 rounded-xl"
                />
              </div>
              <div>
                <Label>Expiry Date *</Label>
                <Input
                  type="date"
                  value={formData.license_expiry}
                  onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
                  className="mt-1.5 rounded-xl"
                />
              </div>
            </div>
            <div>
              <Label>Upload License Photo *</Label>
              <div className="mt-1.5">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleFileUpload('license_photo', e.target.files[0])}
                    className="hidden"
                  />
                  <div className="text-center">
                    {uploading === 'license_photo' ? (
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
                    ) : uploadedFiles.license_photo ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-green-600">Uploaded</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Click to upload</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Make *</Label>
                <Input
                  value={formData.vehicle_make}
                  onChange={(e) => setFormData({ ...formData, vehicle_make: e.target.value })}
                  placeholder="Toyota"
                  className="mt-1.5 rounded-xl"
                />
              </div>
              <div>
                <Label>Model *</Label>
                <Input
                  value={formData.vehicle_model}
                  onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })}
                  placeholder="Camry"
                  className="mt-1.5 rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Year *</Label>
                <Input
                  value={formData.vehicle_year}
                  onChange={(e) => setFormData({ ...formData, vehicle_year: e.target.value })}
                  placeholder="2020"
                  className="mt-1.5 rounded-xl"
                />
              </div>
              <div>
                <Label>Color *</Label>
                <Input
                  value={formData.vehicle_color}
                  onChange={(e) => setFormData({ ...formData, vehicle_color: e.target.value })}
                  placeholder="Black"
                  className="mt-1.5 rounded-xl"
                />
              </div>
            </div>
            <div>
              <Label>License Plate *</Label>
              <Input
                value={formData.vehicle_plate}
                onChange={(e) => setFormData({ ...formData, vehicle_plate: e.target.value })}
                placeholder="ABC123"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Vehicle Registration *</Label>
              <div className="mt-1.5">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => e.target.files[0] && handleFileUpload('vehicle_registration', e.target.files[0])}
                    className="hidden"
                  />
                  <div className="text-center">
                    {uploading === 'vehicle_registration' ? (
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
                    ) : uploadedFiles.vehicle_registration ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-green-600">Uploaded</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Click to upload</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Insurance Provider *</Label>
              <Input
                value={formData.insurance_provider}
                onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                placeholder="State Farm"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Policy Number *</Label>
              <Input
                value={formData.insurance_policy_number}
                onChange={(e) => setFormData({ ...formData, insurance_policy_number: e.target.value })}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Expiry Date *</Label>
              <Input
                type="date"
                value={formData.insurance_expiry}
                onChange={(e) => setFormData({ ...formData, insurance_expiry: e.target.value })}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Insurance Document *</Label>
              <div className="mt-1.5">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => e.target.files[0] && handleFileUpload('insurance_document', e.target.files[0])}
                    className="hidden"
                  />
                  <div className="text-center">
                    {uploading === 'insurance_document' ? (
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
                    ) : uploadedFiles.insurance_document ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-green-600">Uploaded</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Click to upload</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label>Account Holder Name *</Label>
              <Input
                value={formData.bank_account_holder}
                onChange={(e) => setFormData({ ...formData, bank_account_holder: e.target.value })}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Bank Name *</Label>
              <Input
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                placeholder="Chase, Bank of America, etc."
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Account Number *</Label>
              <Input
                value={formData.bank_account_number}
                onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                type="password"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Routing Number *</Label>
              <Input
                value={formData.bank_routing_number}
                onChange={(e) => setFormData({ ...formData, bank_routing_number: e.target.value })}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-blue-800">
                🔒 Your bank details are encrypted and securely stored. Payouts are processed weekly every Monday.
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-lg text-gray-900">Ready to Submit</h3>
              </div>
              <p className="text-sm text-gray-600">
                Please review your information. Once submitted, our AI system will verify your documents within 2-4 hours.
              </p>
            </div>
            
            {existingProfile && existingProfile.onboarding_status !== 'incomplete' && (
              <VerificationStatus profile={existingProfile} />
            )}

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Name: {formData.full_name}</p>
                  <p>Phone: {formData.phone}</p>
                  <p>DOB: {formData.date_of_birth}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Driver License</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>License: {formData.license_number}</p>
                  <p>State: {formData.license_state}</p>
                  <p>Expires: {formData.license_expiry}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Vehicle</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{formData.vehicle_year} {formData.vehicle_make} {formData.vehicle_model}</p>
                  <p>Color: {formData.vehicle_color}</p>
                  <p>Plate: {formData.vehicle_plate}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Insurance</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Provider: {formData.insurance_provider}</p>
                  <p>Policy: {formData.insurance_policy_number}</p>
                  <p>Expires: {formData.insurance_expiry}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Bank Account</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Holder: {formData.bank_account_holder}</p>
                  <p>Bank: {formData.bank_name}</p>
                  <p>Account: ****{formData.bank_account_number.slice(-4)}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Onboarding</h1>
          <p className="text-gray-600">Complete your profile to start driving</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex flex-col items-center ${index < STEPS.length - 1 ? 'mr-4' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={`text-xs mt-2 ${currentStep >= step.id ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`h-0.5 w-12 transition-colors ${currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / STEPS.length) * 100} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div className="ml-auto">
                {currentStep < 6 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={saveMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 rounded-xl"
                  >
                    {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}