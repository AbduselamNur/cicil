import React, { useState } from "react";
import {
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text,
  View,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  FontFamily,
  FontSize,
  Color,
  Padding,
  Border,
} from "../Style/GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Lender");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);

  const navigation = useNavigation();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://sapi.cicil.biz.id:8443/kancil/user/auth/apis/v2/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization:
              "Basic YmFjay1vZmZpY2UtaW50ZXJuYWw6Smt0dzNYSDBHRW9ZQzlyWmtWSzE=",
          },
          body: JSON.stringify({
            PhoneNumber: phoneNumber,
            Password: password,
            Type: userType.toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const token = data.data.token;
        const expirationTimestamp = Date.now() + 60 * 60 * 1000;

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem(
          "tokenExpiration",
          expirationTimestamp.toString()
        );
        await AsyncStorage.setItem("userType", userType);

        navigation.replace(
          userType === "Lender" ? "LenderHome" : "BorrowerHome"
        );
      } else {
        const errorMessages = data.error_description;
        Alert.alert("Kesalahan", errorMessages);
      }
    } catch (error) {
      const errorMessages = data.error_description;

      Alert.alert("Kesalahan", errorMessages || "Terjadi kesalahan");
      console.log("error", error);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.login}>
      <View style={styles.content}>
        <Image
          style={styles.logoCicilSupplyChain}
          contentFit="cover"
          source={require("../assets/Cicil_Logo.png")}
        />
        <View style={styles.masuk}>
          <Image
            style={styles.illustrationIcon}
            contentFit="cover"
            source={require("../assets/Login_Illustration.png")}
          />
          <View style={styles.textfieldWithLabel}>
            <View style={styles.labelTextParent}>
              <Text style={[styles.labelText, styles.textLayout]}>
                Nomor Ponsel
              </Text>
              <Text style={[styles.text, styles.textLayout]}>*</Text>
            </View>
            <View style={styles.infoSpaceBlock}>
              <View
                style={[
                  styles.textField,
                  !isPhoneNumberValid && { borderColor: Color.statusColorRed },
                ]}
              >
                <Text
                  style={[styles.prefixLabel, styles.prefixLabelTypo]}
                  numberOfLines={1}
                >
                  +62
                </Text>
                <View style={styles.caret} />
                <View style={styles.placeholderSection}>
                  <TextInput
                    style={styles.placeholder}
                    placeholder="Masukkan nomor ponsel"
                    value={phoneNumber}
                    keyboardType="phone-pad"
                    onChangeText={(text) => {
                      setPhoneNumber(text);
                      const phoneNumberRegex = /^[0-9]{8,14}$/;
                      setIsPhoneNumberValid(phoneNumberRegex.test(text));
                    }}
                  />
                </View>
              </View>
            </View>
            {isPhoneNumberValid ? null : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  color: "red",
                }}
              >
                <Image
                  source={require("../assets/danger.png")}
                  style={styles.warningIcon}
                />
                <Text style={styles.warningText}>
                  Format nomor ponsel salah
                </Text>
              </View>
            )}
          </View>
          <View style={styles.textfieldWithLabel}>
            <View style={styles.labelTextParent}>
              <Text style={[styles.labelText, styles.textLayout]}>
                Kata Sandi
              </Text>
              <Text style={[styles.text, styles.textLayout]}>*</Text>
            </View>
            <View style={styles.infoSpaceBlock}>
              <View
                style={[
                  styles.textField,
                  !isPasswordValid && { borderColor: Color.statusColorRed },
                ]}
              >
                <View style={styles.placeholderSection}>
                  <TextInput
                    style={styles.placeholder}
                    secureTextEntry={!isPasswordVisible}
                    placeholder="Masukkan kata sandi"
                    onChangeText={(text) => {
                      setPassword(text);
                      const passwordRegex =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
                      setIsPasswordValid(passwordRegex.test(text));
                    }}
                    value={password}
                  />
                </View>

                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Image
                    style={[styles.icon2, styles.iconLayout1]}
                    resizeMode="cover"
                    source={
                      isPasswordVisible
                        ? require("../assets/show_icon.png")
                        : require("../assets/hide_icon.png")
                    }
                  />
                </TouchableOpacity>
              </View>
              {isPasswordValid ? null : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    color: "red",
                  }}
                >
                  <Image
                    source={require("../assets/danger.png")}
                    style={styles.warningIcon}
                  />
                  <Text style={styles.warningText}>
                    Kata sandi harus terdiri dari min 8 karakter, huruf besar,
                    huruf kecil, dan angka
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.inputs}>
            <View style={styles.switchButton}>
              <View
                style={[
                  styles.subtleButtonSmall,
                  styles.containerActive,
                  {
                    backgroundColor:
                      userType === "Lender"
                        ? Color.textColorDarkGrey
                        : Color.oRANGE50,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Switch
                  trackColor={{
                    false: Color.textColorDarkGrey,
                    true: Color.oRANGE50,
                  }}
                  thumbColor="white"
                  value={userType === "Borrower"}
                  onValueChange={(value) => {
                    setUserType(value ? "Borrower" : "Lender");
                  }}
                  style={styles.switch}
                />
              </View>
              <Text style={styles.switchedOn}>{userType} </Text>
            </View>
          </View>
          <View style={styles.textfieldWithLabel}>
            <View style={[styles.subtleButtonSmall, styles.subtleSpaceBlock]}>
              <Text style={[styles.button, styles.textLayout]}>
                Lupa Kata Sandi
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogin}
              disabled={!isPhoneNumberValid || !isPasswordValid || isLoading}
            >
              <View
                style={[
                  styles.mobilebuttonsV2Filled,
                  styles.belumPunyaAkunParentFlexBox,
                  {
                    backgroundColor:
                      isPhoneNumberValid && isPasswordValid
                        ? Color.oRANGE50
                        : Color.colorLightgray,
                  },
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                  <Text style={[styles.masuk2, styles.textLayout]}>Masuk</Text>
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.belumPunyaAkunParentFlexBox}>
              <Text
                style={[styles.belumPunyaAkun, styles.textLayout]}
              >{`Belum punya akun? `}</Text>
              <View
                style={[styles.subtleButtonSmall1, styles.subtleSpaceBlock]}
              >
                <Text style={[styles.button, styles.textLayout]}>Register</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.cicilAmanSertaContainer1}>
          <Text style={styles.cicilAmanSertaSudahBerizin}>
            <Text style={styles.cicilAmanSerta}>
              Cicil aman serta sudah berizin dan diawasi oleh
            </Text>
          </Text>
        </Text>
        <Text style={styles.otoritasJasaKeuangan}>Otoritas Jasa Keuangan</Text>
        <View style={styles.frameParent}>
          <View style={styles.iso2700120131Wrapper}>
            <Image
              style={styles.iso2700120131Icon}
              contentFit="cover"
              source={require("../assets/iso.jpg")}
            />
          </View>
          <View style={styles.afpiLogo1Wrapper}>
            <Image
              style={styles.afpiLogo1Icon}
              contentFit="cover"
              source={require("../assets/afpi.png")}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerActive: {
    borderRadius: 20,
    height: 31,
    width: 51,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.2 }],
  },
  warningIcon: { width: 19, height: 19, marginRight: 5 },
  warningText: {
    color: "red",
    fontFamily: FontFamily.poppinsSemiBold,
    marginTop: 5,
  },
  prefixLabelTypo: {
    lineHeight: 22,
    fontSize: FontSize.size_sm,
    color: Color.textColorBlack,
    fontFamily: FontFamily.captionNormalRegular,
    letterSpacing: 0.1,
  },
  textLayout: {
    lineHeight: 19,
    fontSize: FontSize.captionNormalRegular_size,
  },
  infoSpaceBlock: {
    marginTop: 4,
    alignSelf: "stretch",
  },
  iconLayout1: {
    width: 24,
    height: 24,
  },
  subtleSpaceBlock: {
    paddingVertical: Padding.p_9xs,
    paddingHorizontal: 0,
    flexDirection: "row",
    borderRadius: Border.br_sm,
    alignItems: "center",
  },
  belumPunyaAkunParentFlexBox: {
    marginTop: 8,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  logoCicilSupplyChain: {
    width: 123,
    height: 48,
    overflow: "hidden",
  },
  illustrationIcon: {
    width: 156,
    height: 200,
    marginTop: 12,
  },
  labelText: {
    textAlign: "left",
    color: Color.textColorBlack,
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
  },
  text: {
    color: Color.statusColorRed,
    marginLeft: 2,
    textAlign: "left",
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
    display: "none",
  },
  labelTextParent: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  prefixLabel: {
    display: "flex",
    width: 33,
    height: 24,
    textAlign: "left",
    color: Color.textColorBlack,
    fontFamily: FontFamily.captionNormalRegular,
    alignItems: "center",
    overflow: "hidden",
  },
  caret: {
    backgroundColor: Color.textColorDarkGrey,
    width: 1,
    marginLeft: 10,
    alignSelf: "stretch",
  },
  placeholder: {
    height: 22,
    color: Color.textColorDarkGrey,
    textAlign: "left",
    fontFamily: FontFamily.captionNormalRegular,
    lineHeight: 22,
    fontSize: FontSize.size_sm,
    letterSpacing: 0.1,
    overflow: "hidden",
    flex: 1,
  },
  placeholderSection: {
    marginLeft: 10,
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textField: {
    borderRadius: Border.br_xs,
    borderStyle: "solid",
    borderColor: Color.colorLightgray,
    borderWidth: 1,
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_3xs,
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: Color.gRAYSCALESnow,
  },
  textfieldWithLabel: {
    marginTop: 12,
    alignSelf: "stretch",
  },
  icon2: {
    marginLeft: 10,
  },
  switchedOn: {
    fontSize: FontSize.size_base,
    lineHeight: 26,
    marginLeft: 8,
    textAlign: "left",
    color: Color.textColorBlack,
    fontFamily: FontFamily.captionNormalRegular,
    letterSpacing: 0.1,
    flex: 1,
  },
  switchButton: {
    width: 212,
    flexDirection: "row",
    alignItems: "center",
  },
  inputs: {
    paddingVertical: Padding.p_5xs,
    paddingHorizontal: 0,
    justifyContent: "center",
    marginTop: 12,
    alignSelf: "stretch",
  },
  button: {
    color: Color.oRANGE50,
    textAlign: "right",
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
  },
  subtleButtonSmall: {
    justifyContent: "center",
    paddingVertical: Padding.p_9xs,
    alignSelf: "stretch",
  },
  masuk2: {
    color: Color.gRAYSCALESnow,
    marginLeft: 4,
    textAlign: "center",
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
  },
  mobilebuttonsV2Filled: {
    borderRadius: 10,
    padding: Padding.p_5xs,
    height: 40,
  },
  belumPunyaAkun: {
    color: Color.textColorBlack,
    fontFamily: FontFamily.captionNormalRegular,
    textAlign: "center",
  },
  subtleButtonSmall1: {
    justifyContent: "flex-end",
    marginLeft: 8,
  },
  cicilAmanSerta: {
    fontSize: FontSize.size_3xs,
  },
  cicilAmanSertaSudahBerizin: {
    fontFamily: FontFamily.captionNormalRegular,
  },
  otoritasJasaKeuangan: {
    fontWeight: "800",
    fontFamily: FontFamily.poppinsBold,
    fontSize: FontSize.size_3xs,
  },
  masuk: {
    paddingHorizontal: Padding.p_3xs,
    paddingVertical: 24,
    marginTop: 16,
    backgroundColor: Color.gRAYSCALESnow,
    borderRadius: Border.br_sm,
    alignItems: "center",
    width: 328,
    overflow: "hidden",
  },
  cicilAmanSertaContainer1: {
    color: Color.textColorBlack,
    textAlign: "center",
    alignSelf: "stretch",
    marginTop: 16,
  },
  iso2700120131Icon: {
    width: 40,
    height: 40,
  },
  iso2700120131Wrapper: {
    height: 39,
    width: 80,
    alignItems: "center",
    overflow: "hidden",
    flex: 1,
  },
  afpiLogo1Icon: {
    width: 40,
    height: 24,
    overflow: "hidden",
  },
  afpiLogo1Wrapper: {
    marginLeft: 12,
    alignItems: "center",
    overflow: "hidden",
    flex: 1,
  },
  frameParent: {
    flexDirection: "row",
    alignSelf: "stretch",
    marginTop: 16,
    alignItems: "center",
  },
  content: {
    marginLeft: -164,
    top: 20,
    left: "50%",
    alignItems: "center",
    width: 328,
    position: "absolute",
  },
  login: {
    backgroundColor: "#f4f9fd",
    width: "100%",
    height: 800,
    overflow: "hidden",
    flex: 1,
  },
});

export default Login;
