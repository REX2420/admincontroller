"use client";

import React, { useState } from "react";
import { 
  Paper, 
  Title, 
  TextInput, 
  Textarea, 
  Button, 
  Group, 
  Alert,
  Grid
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { updateCompanyInfo } from "@/lib/database/actions/admin/footer/footer.actions";
import { MdInfo } from "react-icons/md";

interface CompanyInfoFormProps {
  footerData: any;
  onUpdate: () => void;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ footerData, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: footerData?.companyInfo?.name || "VIBECART",
      description: footerData?.companyInfo?.description || "",
      street: footerData?.companyInfo?.address?.street || "",
      city: footerData?.companyInfo?.address?.city || "",
      state: footerData?.companyInfo?.address?.state || "",
      zipCode: footerData?.companyInfo?.address?.zipCode || "",
      country: footerData?.companyInfo?.address?.country || "",
      email: footerData?.companyInfo?.contact?.email || "",
      phone: footerData?.companyInfo?.contact?.phone || "",
      website: footerData?.companyInfo?.contact?.website || "",
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const companyInfo = {
        name: values.name,
        description: values.description,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country,
        },
        contact: {
          email: values.email,
          phone: values.phone,
          website: values.website,
        },
      };

      const response = await updateCompanyInfo(companyInfo);
      
      if (response.success) {
        alert("Company information updated successfully!");
        onUpdate();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error updating company info:", error);
      alert("Error updating company information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md">
      <Title order={2} mb="lg">Company Information</Title>
      
      <Alert icon={<MdInfo />} title="Company Info" mb="lg">
        Update your company information that will appear in the footer.
      </Alert>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Company Name"
              placeholder="Enter company name"
              {...form.getInputProps('name')}
              required
            />
          </Grid.Col>
          
          <Grid.Col span={6}>
            <TextInput
              label="Website"
              placeholder="https://yourcompany.com"
              {...form.getInputProps('website')}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              label="Company Description"
              placeholder="Brief description of your company"
              rows={3}
              {...form.getInputProps('description')}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Title order={3} size="md" mt="lg" mb="sm">Address Information</Title>
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput
              label="Street Address"
              placeholder="123 Main Street"
              {...form.getInputProps('street')}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="City"
              placeholder="City"
              {...form.getInputProps('city')}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <TextInput
              label="State"
              placeholder="State"
              {...form.getInputProps('state')}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <TextInput
              label="Zip Code"
              placeholder="12345"
              {...form.getInputProps('zipCode')}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Country"
              placeholder="Country"
              {...form.getInputProps('country')}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Title order={3} size="md" mt="lg" mb="sm">Contact Information</Title>
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Email"
              placeholder="contact@company.com"
              type="email"
              {...form.getInputProps('email')}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Phone"
              placeholder="+1 (555) 123-4567"
              {...form.getInputProps('phone')}
            />
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt="xl">
          <Button type="submit" loading={loading}>
            Save Company Information
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default CompanyInfoForm; 