/*import { Tabs } from "expo-router";
import React from "react";
import AppTabBar from "@/components/AppTabBar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="serviceRequestScreen"
        options={{
          title: "Home",
        }}
      />

      

      <Tabs.Screen
        name="request-progress"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />
    </Tabs>
  );
}*/
import AppTabBar from "@/components/AppTabBar";
import { Tabs } from "expo-router";
import React from "react";

export default function ProviderTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      // Your custom tab bar will now only handle provider routes
      tabBar={(props) => <AppTabBar {...props} />}
    >
      {/* 
        This handles the default route. 
        In (provider)/index.tsx, you should have your Dashboard.
      */}
      {/* 
        Provider Profile Tab
      */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
        }}
      />

      {/* 
        HIDDEN SCREENS:
        Any screen you put in the (provider) folder that 
        SHOULD NOT be a tab must be defined with href: null
      */}
      <Tabs.Screen
        name="[id]"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="service-requests"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
