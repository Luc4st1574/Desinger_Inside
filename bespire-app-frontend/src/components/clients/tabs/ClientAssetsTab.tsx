import React from 'react';
import BrandsSection from '@/components/brands/BrandsSection';

interface ClientMinimal {
  companyData?: { _id?: string } | null;
  companyId?: string;
  workspaceId?: string;
}

interface ClientAssetsTabProps {
  client: ClientMinimal;
}

const ClientAssetsTab: React.FC<ClientAssetsTabProps> = ({ client }) => {
  console.log("client data in assets tab", client)
  // Prefer companyData._id (company record) or companyId property
  const workspaceId = client?.workspaceId || undefined;

  return (
    <div className="w-full">
      <BrandsSection workspaceId={workspaceId} allowCreate inlineModal isClientDetail />
    </div>
  );
};

export default ClientAssetsTab;
