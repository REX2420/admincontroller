"use client";

import { useForm } from "@mantine/form";
import { useState } from "react";

import {
  TextInput,
  Button,
  Box,
  LoadingOverlay,
  Switch,
  NumberInput,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { createMarqueeText } from "@/lib/database/actions/admin/marquee/marquee.actions";

const CreateMarqueeText = ({ setMarqueeTexts }: { setMarqueeTexts: any }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      text: "",
      isActive: true,
      order: 0,
    },
    validate: {
      text: (value) =>
        value.length < 5 ? "Marquee text must be at least 5 characters." : null,
    },
  });

  const submitHandler = async (values: typeof form.values) => {
    try {
      setLoading(true);
      await createMarqueeText(
        values.text,
        values.isActive,
        values.order
      )
        .then((res) => {
          if (res?.success) {
            setMarqueeTexts(res?.marqueeTexts);
            form.reset();
            alert(res?.message);
            setLoading(false);
          } else {
            alert(res?.message);
          }
        })
        .catch((err) => {
          alert("Error: " + err);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      <Box pos={"relative"}>
        {loading && (
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        )}
        <form onSubmit={form.onSubmit(submitHandler)}>
          <div className="titleStyle">Create Marquee Text</div>
          
          <TextInput
            label="Marquee Text"
            placeholder="Enter marquee text (e.g., ✨ Free delivery on all PrePaid Orders)"
            {...form.getInputProps("text")}
            className="mb-4"
          />

          <NumberInput
            label="Display Order"
            placeholder="Order of display (0 = first)"
            {...form.getInputProps("order")}
            className="mb-4"
          />

          <Switch
            label="Active"
            description="Toggle to show/hide this marquee text"
            {...form.getInputProps("isActive", { type: "checkbox" })}
            className="mb-4"
          />

          <Button type="submit" className="mt-4">
            Add Marquee Text
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default CreateMarqueeText; 