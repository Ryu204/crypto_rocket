import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CryptoRocketModule = buildModule("CryptoRocketModule", (m) => {  
  const lock = m.contract('CryptoRocket');
  return { lock };
});

export default CryptoRocketModule;
