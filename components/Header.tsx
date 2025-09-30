import { StyleSheet, Text, View } from "react-native";
import React, { ReactDOM } from "react";
import { Octicons } from "@expo/vector-icons";
interface HeaderProp {
  headerTitle: any;
  button: any;
}
const Header = ({ headerTitle, button }: HeaderProp) => {
  return (
    <View style={styles.headerSection}>
      <Text style={styles.logo}>{headerTitle}</Text>
      {button()}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerSection: {
    display: "none",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 8,
    marginBottom: 6,

  },
  logo: {
    color: "black",
    fontSize: 4,
    fontWeight: "bold",
    letterSpacing: 1,
    display: "none",

  },
});
