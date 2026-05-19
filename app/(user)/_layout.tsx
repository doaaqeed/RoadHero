import AppTabBar from "@/components/AppTabBar";
import { Tabs } from "expo-router";
import React from "react";

export default function UserTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
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
