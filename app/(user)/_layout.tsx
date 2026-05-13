import AppTabBar from "@/components/AppTabBar";
import { Tabs } from "expo-router";
import React from "react";

export default function UserTabLayout() {
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
          title: "Home",
        }}
      />

      {/* 
        HIDDEN SCREENS:
        Any screen you put in the (provider) folder that 
        SHOULD NOT be a tab must be defined with href: null
      */}
      <Tabs.Screen
        name="fuelService"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="providerListing"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="requestPending"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tireService"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="towService"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="waitingScreen"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
