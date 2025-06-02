"use server";

import { connectToDatabase } from "@/lib/database/connect";
import Footer from "@/lib/database/models/footer.model";

// Get active footer configuration
export const getActiveFooter = async () => {
  try {
    await connectToDatabase();
    
    const footer = await Footer.findOne({ "settings.isActive": true });
    
    if (!footer) {
      // Return default footer configuration if none exists
      return {
        success: true,
        footer: null,
        message: "No active footer configuration found",
      };
    }
    
    return {
      success: true,
      footer: JSON.parse(JSON.stringify(footer)),
      message: "Footer configuration retrieved successfully",
    };
  } catch (error: any) {
    console.log("Error getting active footer:", error);
    return {
      success: false,
      error: error.message,
      footer: null,
    };
  }
};

// Create or update footer configuration
export const createOrUpdateFooter = async (footerData: any) => {
  try {
    await connectToDatabase();
    
    let footer = await Footer.findOne({ "settings.isActive": true });
    
    if (footer) {
      // Update existing footer
      footer = await Footer.findByIdAndUpdate(
        footer._id,
        footerData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new footer
      footer = await new Footer(footerData).save();
    }
    
    return {
      success: true,
      footer: JSON.parse(JSON.stringify(footer)),
      message: footer ? "Footer updated successfully" : "Footer created successfully",
    };
  } catch (error: any) {
    console.log("Error creating/updating footer:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update company information
export const updateCompanyInfo = async (companyInfo: any) => {
  try {
    await connectToDatabase();
    
    let footer = await Footer.findOne({ "settings.isActive": true });
    
    if (!footer) {
      // Create new footer if none exists
      footer = new Footer({ companyInfo });
    } else {
      // Update existing footer, excluding any logo field from existing data
      const { logo, ...existingCompanyInfo } = footer.companyInfo || {};
      footer.companyInfo = { ...existingCompanyInfo, ...companyInfo };
    }
    
    await footer.save();
    
    return {
      success: true,
      footer: JSON.parse(JSON.stringify(footer)),
      message: "Company information updated successfully",
    };
  } catch (error: any) {
    console.log("Error updating company info:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Add or update social media link
export const addOrUpdateSocialMedia = async (socialMediaData: any) => {
  try {
    await connectToDatabase();
    
    let footer = await Footer.findOne({ "settings.isActive": true });
    
    if (!footer) {
      footer = new Footer({
        socialMedia: [socialMediaData]
      });
    } else {
      const existingIndex = footer.socialMedia.findIndex(
        (sm: any) => sm.platform === socialMediaData.platform
      );
      
      if (existingIndex > -1) {
        footer.socialMedia[existingIndex] = socialMediaData;
      } else {
        footer.socialMedia.push(socialMediaData);
      }
    }
    
    await footer.save();
    
    return {
      success: true,
      footer: JSON.parse(JSON.stringify(footer)),
      message: "Social media link updated successfully",
    };
  } catch (error: any) {
    console.log("Error updating social media:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Remove social media link
export const removeSocialMedia = async (platform: string) => {
  try {
    await connectToDatabase();
    
    const footer = await Footer.findOne({ "settings.isActive": true });
    
    if (!footer) {
      return {
        success: false,
        message: "No footer configuration found",
      };
    }
    
    footer.socialMedia = footer.socialMedia.filter(
      (sm: any) => sm.platform !== platform
    );
    
    await footer.save();
    
    return {
      success: true,
      footer: JSON.parse(JSON.stringify(footer)),
      message: "Social media link removed successfully",
    };
  } catch (error: any) {
    console.log("Error removing social media:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Add or update navigation section
export const addOrUpdateNavigationSection = async (sectionData: any) => {
  try {
    await connectToDatabase();
    
    let footer = await Footer.findOne({ "settings.isActive": true });
    
    if (!footer) {
      footer = new Footer({
        navigationSections: [sectionData]
      });
    } else {
      const existingIndex = footer.navigationSections.findIndex(
        (section: any) => section._id?.toString() === sectionData._id
      );
      
      if (existingIndex > -1) {
        footer.navigationSections[existingIndex] = sectionData;
      } else {
        footer.navigationSections.push(sectionData);
      }
    }
    
    await footer.save();
    
    return {
      success: true,
      footer: JSON.parse(JSON.stringify(footer)),
      message: "Navigation section updated successfully",
    };
  } catch (error: any) {
    console.log("Error updating navigation section:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Remove navigation section
export const removeNavigationSection = async (sectionId: string) => {
  try {
    await connectToDatabase();
    
    const footer = await Footer.findOne({ "settings.isActive": true });
    
    if (!footer) {
      return {
        success: false,
        message: "No footer configuration found",
      };
    }
    
    footer.navigationSections = footer.navigationSections.filter(
      (section: any) => section._id?.toString() !== sectionId
    );
    
    await footer.save();
    
    return {
      success: true,
      footer: JSON.parse(JSON.stringify(footer)),
      message: "Navigation section removed successfully",
    };
  } catch (error: any) {
    console.log("Error removing navigation section:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update newsletter settings
export const updateNewsletterSettings = async (newsletterData: any) => {
  try {
    await connectToDatabase();
    
    let footer = await Footer.findOne({ "settings.isActive": true });
    
    if (!footer) {
      footer = new Footer({
        newsletter: newsletterData
      });
    } else {
      footer.newsletter = { ...footer.newsletter, ...newsletterData };
    }
    
    await footer.save();
    
    return {
      success: true,
      footer: JSON.parse(JSON.stringify(footer)),
      message: "Newsletter settings updated successfully",
    };
  } catch (error: any) {
    console.log("Error updating newsletter settings:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update footer settings (colors, active status, etc.)
export const updateFooterSettings = async (settingsData: any) => {
  try {
    await connectToDatabase();
    
    let footer = await Footer.findOne({ "settings.isActive": true });
    
    if (!footer) {
      footer = new Footer({
        settings: settingsData
      });
    } else {
      footer.settings = { ...footer.settings, ...settingsData };
    }
    
    await footer.save();
    
    return {
      success: true,
      footer: JSON.parse(JSON.stringify(footer)),
      message: "Footer settings updated successfully",
    };
  } catch (error: any) {
    console.log("Error updating footer settings:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update localization settings
export const updateLocalizationSettings = async (localizationData: any) => {
  try {
    await connectToDatabase();
    
    let footer = await Footer.findOne({ "settings.isActive": true });
    
    if (!footer) {
      footer = new Footer({
        localization: localizationData
      });
    } else {
      footer.localization = { ...footer.localization, ...localizationData };
    }
    
    await footer.save();
    
    return {
      success: true,
      footer: JSON.parse(JSON.stringify(footer)),
      message: "Localization settings updated successfully",
    };
  } catch (error: any) {
    console.log("Error updating localization settings:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update copyright settings
export const updateCopyrightSettings = async (copyrightData: any) => {
  try {
    await connectToDatabase();
    
    let footer = await Footer.findOne({ "settings.isActive": true });
    
    if (!footer) {
      footer = new Footer({
        copyright: copyrightData
      });
    } else {
      footer.copyright = { ...footer.copyright, ...copyrightData };
    }
    
    await footer.save();
    
    return {
      success: true,
      footer: JSON.parse(JSON.stringify(footer)),
      message: "Copyright settings updated successfully",
    };
  } catch (error: any) {
    console.log("Error updating copyright settings:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create default footer configuration
export const createDefaultFooter = async () => {
  try {
    await connectToDatabase();
    
    const existingFooter = await Footer.findOne({ "settings.isActive": true });
    if (existingFooter) {
      return {
        success: true,
        footer: JSON.parse(JSON.stringify(existingFooter)),
        message: "Footer configuration already exists",
      };
    }
    
    const defaultFooter = new Footer({
      companyInfo: {
        name: "Iilaanshop",
        description: "",
        address: {
          street: "Majeedheemagu",
          city: "Male'city",
          state: "Maldives",
          zipCode: "20002",
          country: "Maldives",
        },
        contact: {
          email: "iulaanshop@gmail.com",
          phone: "+960 9777302",
        },
      },
      socialMedia: [
        { platform: "facebook", url: "https://facebook.com/vibecart", isActive: true },
        { platform: "instagram", url: "https://instagram.com/vibecart", isActive: true },
        { platform: "youtube", url: "https://youtube.com/vibecart", isActive: true },
        { platform: "twitter", url: "https://twitter.com/vibecart", isActive: true },
      ],
      navigationSections: [
        {
          sectionTitle: "COMPANY",
          links: [
            { title: "About Us", url: "/about", isActive: true, order: 1 },
            { title: "Careers", url: "/careers", isActive: true, order: 2 },
            { title: "Affiliates", url: "/affiliates", isActive: true, order: 3 },
            { title: "Blog", url: "/blog", isActive: true, order: 4 },
            { title: "Contact Us", url: "/contact", isActive: true, order: 5 },
          ],
          isActive: true,
          order: 1,
        },
        {
          sectionTitle: "SHOP",
          links: [
            { title: "New Arrivals", url: "/shop/new-arrivals", isActive: true, order: 1 },
            { title: "Accessories", url: "/shop/accessories", isActive: true, order: 2 },
            { title: "Men", url: "/shop/men", isActive: true, order: 3 },
            { title: "Women", url: "/shop/women", isActive: true, order: 4 },
            { title: "All Products", url: "/shop", isActive: true, order: 5 },
          ],
          isActive: true,
          order: 2,
        },
        {
          sectionTitle: "HELP",
          links: [
            { title: "Customer Service", url: "/help/customer-service", isActive: true, order: 1 },
            { title: "My Account", url: "/profile", isActive: true, order: 2 },
            { title: "Find a Store", url: "/stores", isActive: true, order: 3 },
            { title: "Legal & Privacy", url: "/legal", isActive: true, order: 4 },
            { title: "Gift Card", url: "/gift-cards", isActive: true, order: 5 },
          ],
          isActive: true,
          order: 3,
        },
      ],
      // Newsletter Settings
      newsletter: {
        title: "SUBSCRIBE",
        description: "Be the first to get the latest news about trends, promotions, new arrivals, discounts and more!",
        buttonText: "JOIN",
        isActive: true,
      },
      // Copyright Settings
      copyright: {
        text: "© 2025 Iilaanshop",
        showYear: true,
      },
      // Localization Settings
      localization: {
        language: "English",
        country: "Maldives",
        currency: "MVR",
        showLanguage: true,
        showCurrency: true,
      },
      // Appearance Settings
      settings: {
        showSecurePayments: true,
        securePaymentsText: "Secure Payments",
        backgroundColor: "#1c1c1c",
        textColor: "#ffffff",
        isActive: true,
      },
    });
    
    await defaultFooter.save();
    
    return {
      success: true,
      footer: JSON.parse(JSON.stringify(defaultFooter)),
      message: "Default footer configuration created successfully",
    };
  } catch (error: any) {
    console.log("Error creating default footer:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}; 