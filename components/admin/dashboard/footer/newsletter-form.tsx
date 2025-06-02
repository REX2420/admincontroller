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
  Grid,
  Switch,
  Text
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { updateNewsletterSettings } from "@/lib/database/actions/admin/footer/footer.actions";
import { MdInfo, MdEmail } from "react-icons/md";

interface NewsletterFormProps {
  footerData: any;
  onUpdate: () => void;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ footerData, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: footerData?.newsletter?.title || "SUBSCRIBE",
      description: footerData?.newsletter?.description || "Be the first to get the latest news about trends, promotions, new arrivals, discounts and more!",
      buttonText: footerData?.newsletter?.buttonText || "JOIN",
      isActive: footerData?.newsletter?.isActive ?? true,
    },
    validate: {
      title: (value) => !value ? "Newsletter title is required" : null,
      description: (value) => !value ? "Newsletter description is required" : null,
      buttonText: (value) => !value ? "Button text is required" : null,
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const response = await updateNewsletterSettings(values);
      
      if (response.success) {
        alert("Newsletter settings updated successfully!");
        onUpdate();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error updating newsletter settings:", error);
      alert("Error updating newsletter settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md">
      <Title order={2} mb="lg">Newsletter Settings</Title>
      
      <Alert icon={<MdInfo />} title="Newsletter Configuration" mb="lg">
        Configure the newsletter subscription section that appears in the footer.
      </Alert>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <Switch
              {...form.getInputProps('isActive', { type: 'checkbox' })}
              label="Enable Newsletter Section"
              description="When enabled, the newsletter subscription section will appear in the footer"
              mb="lg"
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Newsletter Title"
              placeholder="SUBSCRIBE"
              {...form.getInputProps('title')}
              required
              leftSection={<MdEmail size={16} />}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Button Text"
              placeholder="JOIN"
              {...form.getInputProps('buttonText')}
              required
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              label="Newsletter Description"
              placeholder="Be the first to get the latest news about trends, promotions, new arrivals, discounts and more!"
              rows={4}
              {...form.getInputProps('description')}
              required
            />
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt="xl">
          <Button type="submit" loading={loading}>
            Save Newsletter Settings
          </Button>
        </Group>
      </form>

      {/* Preview Section */}
      {form.values.isActive && (
        <Paper withBorder p="md" mt="xl" style={{ backgroundColor: '#f8f9fa' }}>
          <Title order={3} size="md" mb="md">Preview</Title>
          <div style={{ maxWidth: '400px' }}>
            <Title order={4} size="sm" mb="sm">{form.values.title || "SUBSCRIBE"}</Title>
            <Text size="sm" mb="md" c="dimmed">{form.values.description || "Newsletter description..."}</Text>
            <Group gap={0}>
              <TextInput
                placeholder="Email Address"
                style={{ flex: 1 }}
                styles={{ input: { borderRadius: '4px 0 0 4px' } }}
                disabled
              />
              <Button
                style={{ borderRadius: '0 4px 4px 0' }}
                disabled
              >
                {form.values.buttonText || "JOIN"}
              </Button>
            </Group>
          </div>
        </Paper>
      )}
    </Paper>
  );
};

export default NewsletterForm; 