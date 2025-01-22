import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "ton-core";
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const [balance, setBalance] = useState<null | bigint>(null);// eski kod claude baba değiştirdi const [balance, setBalance] = useState<null |  number>(0);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(//asagıdaki ksıım  contactımızın EQ ile baslayan adresini yazıyoruz
      Address.parse("EQA8kqG5uLPi2NJKLPcGtA-hLdK7yd6V7UNtAzOOlAoXCRCf") // replace with your address from tutorial 2 step 8 front endimizin hangi contract ile etkileşime gececegini belirliyen yer
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const {balance} = await mainContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(balance);
      await sleep(5000); // sleep 5 seconds and poll value again counter valuenin 5 saniyede bir arrtmıssmı artamamısmı onu kontrol ediyor 
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance ? Number(balance) / 1e9 : null,
    ...contractData,
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender, toNano("0.1"), 1);
    },
    sendDeposit: async () => {
      return mainContract?.sendDeposit(sender, toNano("1"));
    },
    sendWithdrawalRequest: async () => {
      return mainContract?.sendWithdrawalRequest(
        sender,
         toNano("0.2"),
          toNano("0.7")
      )
    }
};
/* eski kod claude babadegiştirdi

 return {
   contract_address: mainContract?.address.toString(),
   contract_balance: balance,
   ...contractData,
 };*/


}
