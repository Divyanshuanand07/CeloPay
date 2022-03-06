import React, { useCallback, useEffect, useState } from 'react'
import { useContractKit } from '@celo-tools/use-contractkit'
import { ContractKitProvider } from '@celo-tools/use-contractkit';
import '@celo-tools/use-contractkit/lib/styles.css';

function App () {
  const { address, connect } = useContractKit()

  return (
    <main>
      <h1><center>Celo Pay</center></h1>
      <p>{address}</p>
      <button onClick={connect}>Click here to connect your wallet</button>
    </main>
  )
}

function GovernanceApp() {
  const { address, connect, kit, getConnectedKit } = useContractKit()
  const [proposals, setProposals] = useState([])

  const fetchProposals = useCallback(async () => {
    const governance = await kit.contracts.getGovernance()
    const dequeue = await governance.getDequeue()

    const fetchedProposals = await Promise.all(
      dequeue.map(async (id) => ({ id, ...(await governance.getProposalRecord(id)) }))
    )
    setProposals(fetchedProposals)
  }, [kit])

  useEffect(() => {
    fetchProposals()
  }, [fetchProposals])

  return (
    <div>
      <h1><center>Celo Pay</center></h1>
      <p>{address}</p>
      <button onClick={connect}>Click here to connect your wallet</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Description URL</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal) => (
            <tr>
              <td>{proposal.id.toString()}</td>
              <td>{proposal.passed ? 'Passed' : proposal.approved ? 'Approved' : 'Not approved'}</td>
              <td>
                <a href={proposal.metadata.descriptionURL} target="_blank" style={{ color: 'blue', textDecoration: 'underline' }} >
                  Link
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function WrappedApp() {
  return (
    <ContractKitProvider
      dapp={{
          name: "My awesome dApp",
          description: "My awesome description",
          url: "https://example.com",
        }}
    >
      <GovernanceApp />
    </ContractKitProvider>
  );
}
export default WrappedApp;

// app.listen(process.env.PORT || 3000,function()
// {
//   console.log("Server is running on port 3000")
// });