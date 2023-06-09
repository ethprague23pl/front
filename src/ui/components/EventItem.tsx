import { useMutation, useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Platform, Pressable, View, useWindowDimensions } from "react-native";

import { ButtonVariant, ButtonView } from "./ButtonView";
import { TextView } from "./TextView";
import { showToast } from "./Toast";
import { api } from "../../data/api";
import { Event } from "../../data/generated-api";
import { queryKeys } from "../../data/queryKeys";
import { paths } from "../../domain/paths";
import { tokenSelector, useStore } from "../../domain/store";
import { Colors } from "../styleguide/Styleguide";

export const EventItem = ({
  item,
  navEnabled = true,
}: {
  item: Event;
  navEnabled?: boolean;
}) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const token = useStore(tokenSelector);

  const buyTicketMutation = useMutation({
    mutationFn: () =>
      api.ticket.buyTicketTicketPost({
        eventContractAddress: item.contract_address,
        jwt_token: token!,
        privateKey: "",
        ticketQuantity: 1,
      }),
    onError: () => {
      showToast("Something went wrong, try again");
    },
    onSuccess: () => {
      showToast("Ticket bought");
    },
  });

  const ticketsQuery = useQuery({
    queryKey: queryKeys.tickets(item.contract_address),
    queryFn: () =>
      api.ticket.getTicketTicketGet({
        eventContractAddress: item.contract_address,
        jwt_token: useStore.getState().token!,
      }),
  });

  return (
    <Pressable
      style={{ flex: 1, width }}
      onPress={() => {
        if (navEnabled) {
          router.push(paths.event(item.contract_address));
        }
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignSelf: "center",
          borderRadius: 16,
          flex: 1,
        }}
      >
        <Image
          style={{
            width: Platform.OS === "web" ? width * 0.7 : width * maxWidth,
            height: !navEnabled ? 350 : 550,
            overflow: "hidden",
          }}
          contentPosition="top center"
          source={item.event_image}
          contentFit="cover"
          placeholder={blurhash}
        />

        <TextView
          text={item.name}
          textAlign="center"
          fontSize={28}
          backgroundColor={Colors.darkGray}
          color={Colors.primaryText}
          maxWidth={width * maxWidth}
          padding={16}
        />

        <TextView
          text={new Date(item.start_day).toLocaleDateString()}
          textAlign="center"
          fontSize={24}
          backgroundColor={Colors.darkGray}
          color={Colors.yellow}
          maxWidth={width * maxWidth}
          padding={16}
        />

        {!navEnabled ? (
          <View
            style={{
              // flexDirection: "row",
              // alignSelf: "center",
              gap: 8,
              marginVertical: 8,
            }}
          >
            {(ticketsQuery.data?.length ?? 0) > 0 ? (
              <ButtonView
                onPress={() => {
                  router.push(paths.showQr(item.contract_address));
                }}
                textViewProps={{
                  text: "Show ticket",
                  textAlign: "center",
                }}
                variant={ButtonVariant.secondary}
                style={{
                  padding: 16,
                }}
              />
            ) : null}
          </View>
        ) : null}

        {!navEnabled && token ? (
          <View style={{ gap: 8 }}>
            <ButtonView
              loading={buyTicketMutation.isLoading}
              onPress={buyTicketMutation.mutate}
              textViewProps={{
                text: "Buy Ticket",
                textAlign: "center",
                padding: 4,
              }}
            />

            <ButtonView
              textViewProps={{
                color: Colors.secondary,
                text: "Go to marketplace",
                fontSize: 16,
              }}
              onPress={() => {
                router.push(paths.marketPlace(item.contract_address));
              }}
              variant={ButtonVariant.secondary}
              style={{
                alignItems: "center",
              }}
            />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const maxWidth = 0.9;

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
