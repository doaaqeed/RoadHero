import { Tabs } from "expo-router";
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
}