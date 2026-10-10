import React, { useState } from 'react';

export type ScreenType = 'home' | 'map' | 'stores' | 'reserve' | 'receipt';

export function Router() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeTab, setActiveTab] = useState<'warehouse' | 'cold_store' | 'maps'>('warehouse');
  const [selectedStore, setSelectedStore] = useState({
    name: 'Sri Lakshmi Cold Storage',
    location: 'Guntur · 6 km',
    rate: 38,
    total: 2280,
    tag: 'Registered',
    tagColor: '#34D399'
  });

  const stores = [
    { id: 1, name: 'Sri Lakshmi Cold Storage', location: 'Guntur · 6 km', rate: 38, total: 2280, tag: 'Registered', tagBg: '#064E3B', tagColor: '#34D399' },
    { id: 2, name: 'Vijaya Warehousing Corp', location: 'Tenali · 18 km', rate: 24, total: 1440, tag: 'Registered', tagBg: '#064E3B', tagColor: '#34D399' },
    { id: 3, name: 'Kisan Agri Godown', location: 'Mangalagiri · 27 km', rate: 19, total: 1340, tag: 'Filling fast', tagBg: '#451A03', tagColor: '#FBBF24' },
  ];

  const handleBack = () => {
    if (currentScreen === 'stores' || currentScreen === 'map') setCurrentScreen('home');
    else if (currentScreen === 'reserve') setCurrentScreen('stores');
    else if (currentScreen === 'receipt') setCurrentScreen('reserve');
    else setCurrentScreen('home');
  };

  // Reusable line-art SVG icon component matching Figma wireframes
  const SvgIcon = ({ d, size = 16, color = '#34D399' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d={d} />
    </svg>
  );

  return (
    <div style={{
      width: '100%',
      maxWidth: '430px',
      margin: '0 auto',
      backgroundColor: '#07140E',
      color: '#F8FAFC',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>

      {/* Top Header */}
      <div style={{
        backgroundColor: '#05110B',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #064E3B',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '32px' }}>
          {currentScreen !== 'home' ? (
            <button onClick={handleBack} style={{ background: 'none', border: 'none', color: '#34D399', fontSize: '18px', cursor: 'pointer', padding: '0', fontWeight: 'bold' }}>←</button>
          ) : (
            <div style={{ fontSize: '20px', cursor: 'pointer', color: '#F1F5F9' }} onClick={() => setCurrentScreen('home')}>☰</div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#F1F5F9', letterSpacing: '0.01em' }}>Storage & Godowns</div>
          <div style={{ fontSize: '11px', color: '#34D399', fontWeight: '500', marginTop: '1px' }}>Book · Hold</div>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', width: '32px', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: '11px', background: '#064E3B', padding: '2px 7px', borderRadius: '12px', color: '#34D399', fontWeight: '700' }}>EN</div>
        </div>
      </div>

      {/* Top Tabs with precise Figma symbols */}
      <div style={{ display: 'flex', padding: '12px 16px 8px 16px', gap: '8px', boxSizing: 'border-box', width: '100%' }}>
        <button
          onClick={() => { setActiveTab('warehouse'); setCurrentScreen('home'); }}
          style={{
            flex: 1, padding: '9px 4px', fontSize: '12px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            backgroundColor: activeTab === 'warehouse' && currentScreen === 'home' ? '#153B28' : '#0F2D1E',
            color: activeTab === 'warehouse' && currentScreen === 'home' ? '#A7F3D0' : '#94A3B8'
          }}
        >
          <SvgIcon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={14} color={activeTab === 'warehouse' && currentScreen === 'home' ? '#A7F3D0' : '#94A3B8'} />
          Warehouse
        </button>

        <button
          onClick={() => { setActiveTab('cold_store'); setCurrentScreen('home'); }}
          style={{
            flex: 1, padding: '9px 4px', fontSize: '12px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            backgroundColor: activeTab === 'cold_store' && currentScreen === 'home' ? '#153B28' : '#0F2D1E',
            color: activeTab === 'cold_store' && currentScreen === 'home' ? '#A7F3D0' : '#94A3B8'
          }}
        >
          <SvgIcon d="M12 2v20m10-10H2m15.364-7.364l-14.142 14.142m0-14.142l14.142 14.142" size={14} color={activeTab === 'cold_store' && currentScreen === 'home' ? '#A7F3D0' : '#94A3B8'} />
          Cold store
        </button>

        <button
          onClick={() => { setActiveTab('maps'); setCurrentScreen('map'); }}
          style={{
            flex: 1, padding: '9px 4px', fontSize: '12px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            backgroundColor: currentScreen === 'map' ? '#153B28' : '#0F2D1E',
            color: currentScreen === 'map' ? '#A7F3D0' : '#94A3B8'
          }}
        >
          <SvgIcon d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16" size={14} color={currentScreen === 'map' ? '#A7F3D0' : '#94A3B8'} />
          Maps
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '12px 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, boxSizing: 'border-box', width: '100%' }}>

        {/* SCREEN 1: HOME SEARCH */}
        {currentScreen === 'home' && (
          <>
            <div style={{
              backgroundColor: '#0F2D1E',
              border: '1px solid #064E3B',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #064E3B', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <SvgIcon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={18} color="#34D399" />
                  <div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>Nearby</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#ECFDF5' }}>Guntur, Andhra Pradesh</div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', backgroundColor: '#064E3B', color: '#34D399', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>+ Near me</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid #064E3B', paddingBottom: '10px' }}>
                <SvgIcon d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" size={18} color="#34D399" />
                <div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>Crop</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#ECFDF5' }}>Dry chilli</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid #064E3B', paddingBottom: '10px' }}>
                <SvgIcon d="M12 3v18m9-9H3m15-5l3 5H6l3-5m6 10l3 5H6l3-5" size={18} color="#34D399" />
                <div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>Quantity (quintals)</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#ECFDF5' }}>20</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <SvgIcon d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" size={18} color="#34D399" />
                <div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>Period</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#ECFDF5' }}>3 months</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('stores')}
              style={{
                width: '100%',
                backgroundColor: '#153B28',
                color: '#FFFFFF',
                border: '1px solid #059669',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <SvgIcon d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" size={14} color="#FFF" />
              SEARCH
            </button>

            <div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}>Stores near you</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {stores.map(store => (
                  <div key={store.id} style={{ backgroundColor: '#0F2D1E', border: '1px solid #064E3B', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#ECFDF5' }}>{store.name}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{store.location}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#34D399' }}>₹{store.rate}</div>
                        <div style={{ fontSize: '9px', color: '#94A3B8' }}>per quintal</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #064E3B', paddingTop: '8px' }}>
                      <span style={{ fontSize: '10px', backgroundColor: store.tagBg, color: store.tagColor, padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{store.tag}</span>
                      <button onClick={() => { setSelectedStore(store); setCurrentScreen('reserve'); }} style={{ backgroundColor: '#1B5237', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Reserve</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* SCREEN 2: MAP MODE */}
        {currentScreen === 'map' && (
          <>
            <div style={{ width: '100%', height: '180px', backgroundColor: '#143825', borderRadius: '12px', border: '1px solid #064E3B', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxSizing: 'border-box' }}>
              <div style={{ position: 'absolute', top: '20px', left: '30px', background: '#059669', padding: '6px', borderRadius: '50%', fontSize: '12px' }}>📍</div>
              <div style={{ position: 'absolute', bottom: '30px', right: '40px', background: '#0284C7', padding: '6px', borderRadius: '50%', fontSize: '12px' }}>❄️</div>
              <div style={{ color: '#A7F3D0', fontSize: '11px', fontWeight: '600' }}>🗺️ Interactive Schematic Map View</div>
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Stores near you</div>
            {stores.slice(0, 2).map(store => (
              <div key={store.id} style={{ backgroundColor: '#0F2D1E', border: '1px solid #064E3B', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#ECFDF5' }}>{store.name}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>{store.location} · ₹{store.rate}/quintal</div>
                </div>
                <button onClick={() => { setSelectedStore(store); setCurrentScreen('reserve'); }} style={{ backgroundColor: '#1B5237', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Reserve</button>
              </div>
            ))}
          </>
        )}

        {/* SCREEN 3: STORES LIST */}
        {currentScreen === 'stores' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>20 (quintals) · Dry chilli · 3 months</div>
              <button onClick={() => setCurrentScreen('home')} style={{ fontSize: '11px', background: 'none', border: 'none', color: '#34D399', cursor: 'pointer' }}>Edit Filter</button>
            </div>
            {stores.map(store => (
              <div key={store.id} style={{ backgroundColor: '#0F2D1E', border: '1px solid #064E3B', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#ECFDF5' }}>{store.name}</div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>{store.location}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#34D399' }}>₹{store.rate} <span style={{ fontSize: '9px', color: '#94A3B8' }}>/q</span></div>
                    <div style={{ fontSize: '11px', color: '#A7F3D0', fontWeight: '600' }}>Total ₹{store.total}</div>
                  </div>
                </div>
                <button onClick={() => { setSelectedStore(store); setCurrentScreen('reserve'); }} style={{ backgroundColor: '#1B5237', color: '#FFF', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Reserve Slot</button>
              </div>
            ))}
          </>
        )}

        {/* SCREEN 4: RESERVE SLOT */}
        {currentScreen === 'reserve' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F2D1E', padding: '12px', borderRadius: '10px', border: '1px solid #064E3B' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '22px', height: '22px', backgroundColor: '#059669', color: '#FFF', borderRadius: '50%', margin: '0 auto 4px auto', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                <div style={{ fontSize: '10px', color: '#34D399' }}>Book</div>
              </div>
              <div style={{ height: '2px', flex: 1, backgroundColor: '#064E3B' }}></div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '22px', height: '22px', backgroundColor: '#064E3B', color: '#94A3B8', borderRadius: '50%', margin: '0 auto 4px auto', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                <div style={{ fontSize: '10px', color: '#94A3B8' }}>Hold</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#0F2D1E', border: '1px solid #064E3B', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ fontWeight: 'bold', color: '#ECFDF5', borderBottom: '1px solid #064E3B', paddingBottom: '8px' }}>❄️ {selectedStore.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}><span>Crop</span><span style={{ color: '#ECFDF5', fontWeight: '600' }}>Dry chilli</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}><span>Quantity</span><span style={{ color: '#ECFDF5', fontWeight: '600' }}>20 quintals</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}><span>Period</span><span style={{ color: '#ECFDF5', fontWeight: '600' }}>3 months</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}><span>Storage Fee</span><span style={{ color: '#ECFDF5', fontWeight: '600' }}>₹{selectedStore.total}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399', fontWeight: 'bold', borderTop: '1px solid #064E3B', paddingTop: '8px' }}>
                <span>Pay now (10%)</span>
                <span>₹{Math.round(selectedStore.total * 0.1)}</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('receipt')}
              style={{ width: '100%', backgroundColor: '#1B5237', color: '#FFF', border: '1px solid #059669', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
            >
              Pay with UPI · ₹{Math.round(selectedStore.total * 0.1)}
            </button>
          </>
        )}

        {/* SCREEN 5: E-RECEIPT */}
        {currentScreen === 'receipt' && (
          <>
            <div style={{ backgroundColor: '#0F2D1E', border: '1px solid #064E3B', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#133D27', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #064E3B' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ECFDF5' }}>Warehouse receipt</span>
                <span style={{ backgroundColor: '#059669', color: '#FFF', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>✓ Active</span>
              </div>
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}><span>Storage</span><span style={{ color: '#ECFDF5', fontWeight: '600' }}>{selectedStore.name}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}><span>Crop & Qty</span><span style={{ color: '#ECFDF5', fontWeight: '600' }}>Dry chilli (20q)</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}><span>Grade</span><span style={{ color: '#ECFDF5', fontWeight: '600' }}>A</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}><span>Insurance</span><span style={{ color: '#ECFDF5', fontWeight: '600' }}>₹80,000/t</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}><span>Advance Paid</span><span style={{ color: '#ECFDF5', fontWeight: '600' }}>₹{Math.round(selectedStore.total * 0.1)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399', fontWeight: 'bold', borderTop: '1px solid #064E3B', paddingTop: '8px' }}>
                  <span>Receipt No.</span>
                  <span>GDM-2026-0418</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('home')}
              style={{ width: '100%', backgroundColor: '#153B28', color: '#A7F3D0', border: '1px solid #064E3B', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
            >
              Book another slot
            </button>
          </>
        )}

      </div>
    </div>
  );
}