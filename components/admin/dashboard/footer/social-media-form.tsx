"use client";

import React, { useState } from "react";
import { 
  Paper, 
  Title, 
  TextInput, 
  Button, 
  Group, 
  Alert,
  Grid,
  Select,
  Switch,
  Card,
  Text,
  ActionIcon
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { addOrUpdateSocialMedia, removeSocialMedia } from "@/lib/database/actions/admin/footer/footer.actions";
import { MdAdd, MdDelete, MdInfo } from "react-icons/md";

interface SocialMediaFormProps {
  footerData: any;
  onUpdate: () => void;
}

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({ footerData, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      platform: "",
      url: "",
      isActive: true,
    },
    validate: {
      platform: (value) => !value ? "Platform is required" : null,
      url: (value) => {
        if (!value) return "URL is required";
        try {
          new URL(value);
          return null;
        } catch {
          return "Please enter a valid URL";
        }
      },
    },
  });

  const platforms = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "tiktok", label: "TikTok" },
    { value: "pinterest", label: "Pinterest" },
  ];

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const response = await addOrUpdateSocialMedia(values);
      
      if (response.success) {
        alert("Social media link updated successfully!");
        form.reset();
        onUpdate();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error updating social media:", error);
      alert("Error updating social media link");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (platform: string) => {
    if (!confirm(`Are you sure you want to remove ${platform}?`)) return;

    try {
      const response = await removeSocialMedia(platform);
      
      if (response.success) {
        alert("Social media link removed successfully!");
        onUpdate();
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Error removing social media:", error);
      alert("Error removing social media link");
    }
  };

  const handleToggleActive = async (platform: string, currentStatus: boolean) => {
    const existingLink = footerData?.socialMedia?.find((sm: any) => sm.platform === platform);
    if (!existingLink) return;

    try {
      const response = await addOrUpdateSocialMedia({
        platform,
        url: existingLink.url,
        isActive: !currentStatus,
      });
      
      if (response.success) {
        onUpdate();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error toggling social media status:", error);
    }
  };

  return (
    <Paper p="md">
      <Title order={2} mb="lg">Social Media Management</Title>
      
      <Alert icon={<MdInfo />} title="Social Media Links" mb="lg">
        Add and manage social media links that will appear in the footer.
      </Alert>

      {/* Add New Social Media Form */}
      <Card withBorder p="md" mb="lg">
        <Title order={3} size="md" mb="md">Add New Social Media Link</Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col span={4}>
              <Select
                label="Platform"
                placeholder="Select platform"
                data={platforms}
                {...form.getInputProps('platform')}
                required
              />
            </Grid.Col>
            
            <Grid.Col span={6}>
              <TextInput
                label="URL"
                placeholder="https://facebook.com/yourpage"
                {...form.getInputProps('url')}
                required
              />
            </Grid.Col>

            <Grid.Col span={2}>
              <div style={{ paddingTop: '25px' }}>
                <Button 
                  type="submit" 
                  loading={loading}
                  leftSection={<MdAdd />}
                  fullWidth
                >
                  Add
                </Button>
              </div>
            </Grid.Col>
          </Grid>
        </form>
      </Card>

      {/* Existing Social Media Links */}
      <Title order={3} size="md" mb="md">Current Social Media Links</Title>
      
      {footerData?.socialMedia && footerData.socialMedia.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {footerData.socialMedia.map((social: any, index: number) => (
            <Card key={index} withBorder p="md">
              <Group justify="space-between" align="center">
                <div>
                  <Text fw={500} tt="capitalize">{social.platform}</Text>
                  <Text size="sm" c="dimmed">{social.url}</Text>
                </div>
                
                <Group gap="sm">
                  <Switch
                    checked={social.isActive}
                    onChange={() => handleToggleActive(social.platform, social.isActive)}
                    label={social.isActive ? "Active" : "Inactive"}
                  />
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => handleRemove(social.platform)}
                  >
                    <MdDelete size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          ))}
        </div>
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          No social media links added yet. Add some links above to get started.
        </Text>
      )}
    </Paper>
  );
};

export default SocialMediaForm; 