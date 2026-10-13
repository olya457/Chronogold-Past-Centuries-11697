import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Card, Chips, Field, Screen, Tabs, s, serif } from '../components/UI';
import { centuriesCovered, validYear, yearDistance } from '../utils/history';
const cities: Record<string, [number, number]> = {
  Rome: [41.9028, 12.4964],
  Baghdad: [33.3152, 44.3661],
  Athens: [37.9838, 23.7275],
  Alexandria: [31.2001, 29.9187],
  Constantinople: [41.0082, 28.9784],
  Cairo: [30.0444, 31.2357],
  Venice: [45.4408, 12.3155],
  London: [51.5074, -0.1278],
  Paris: [48.8566, 2.3522],
  'Chang’an': [34.3416, 108.9398],
  Samarkand: [39.627, 66.975],
  Delhi: [28.6139, 77.209],
  Timbuktu: [16.7666, -3.0026],
};
function distance(a: number[], b: number[]) {
  const r = Math.PI / 180;
  const dlat = (b[0] - a[0]) * r;
  const dlon = (b[1] - a[1]) * r;
  const h =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dlon / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}
function Result({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <View style={[s.card, { backgroundColor: '#b77a3c25', marginTop: 8 }]}>
      <Text style={s.label}>{label}</Text>
      <Text style={{ fontFamily: serif, fontSize: 40, color: '#ffb273' }}>
        {value}
      </Text>
      {unit && <Text style={s.chipText}>{unit}</Text>}
    </View>
  );
}
export function ToolsScreen() {
  const [tab, setTab] = useState('Era');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [startEra, setStartEra] = useState('BCE');
  const [endEra, setEndEra] = useState('CE');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [aName, setAName] = useState('');
  const [bName, setBName] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [era, setEra] = useState('Medieval');
  const [method, setMethod] = useState('Ship');
  const [km, setKm] = useState('');
  const startValue = Number(start) * (startEra === 'BCE' ? -1 : 1);
  const endValue = Number(end) * (endEra === 'BCE' ? -1 : 1);
  const valid =
    validYear(start) &&
    validYear(end) &&
    startValue <= endValue &&
    Number(start) > 0 &&
    Number(end) > 0;
  const duration = yearDistance(startValue, endValue);
  const gapValid = validYear(a) && validYear(b);
  const gap = yearDistance(Number(a), Number(b));
  const fromKey = Object.keys(cities).find(
    x => x.toLowerCase() === from.trim().toLowerCase(),
  );
  const toKey = Object.keys(cities).find(
    x => x.toLowerCase() === to.trim().toLowerCase(),
  );
  const estimated =
    fromKey && toKey
      ? Math.round(distance(cities[fromKey], cities[toKey]) * 1.35)
      : 0;
  const routeKm = km ? Number(km) : estimated;
  const speed =
    ({ Foot: 25, Horse: 45, Caravan: 30, Ship: 90 }[method] || 25) *
    ({ Ancient: 0.85, Medieval: 1, 'Early Modern': 1.15 }[era] || 1);
  const journeyValid =
    from.trim() &&
    to.trim() &&
    from.trim().toLowerCase() !== to.trim().toLowerCase() &&
    Number.isFinite(routeKm) &&
    routeKm > 0;
  return (
    <Screen title="Tools" eyebrow="HISTORIAN’S KIT">
      <Tabs
        options={['Era', 'Time Distance', 'Journey']}
        value={tab}
        onChange={setTab}
      />
      <Card>
        <Text
          style={[
            s.h2,
            { color: '#cf9863', fontStyle: 'italic', fontSize: 21 },
          ]}
        >
          {tab === 'Era'
            ? 'How long did an age really last?'
            : tab === 'Time Distance'
            ? 'Measure the gap between two moments.'
            : 'How far, how fast, how perilous?'}
        </Text>
        {tab === 'Era' ? (
          <>
            <Chips
              options={['Pax Romana', 'Tang', 'Dutch']}
              value=""
              onChange={x => {
                const p =
                  x === 'Tang'
                    ? ['618', '907', 'CE']
                    : x === 'Dutch'
                    ? ['1588', '1672', 'CE']
                    : ['27', '180', 'BCE'];
                setStart(p[0]);
                setEnd(p[1]);
                setStartEra(p[2]);
                setEndEra('CE');
              }}
            />
            <Field
              label="Start year"
              value={start}
              onChange={setStart}
              numeric
              placeholder="Year"
            />
            <Chips
              options={['CE', 'BCE']}
              value={startEra}
              onChange={setStartEra}
            />
            <Field
              label="End year"
              value={end}
              onChange={setEnd}
              numeric
              placeholder="Year"
            />
            <Chips
              options={['CE', 'BCE']}
              value={endEra}
              onChange={setEndEra}
            />
            {valid ? (
              <>
                <Result label="TOTAL DURATION" value={duration} unit="years" />
                <Result label="DECADES" value={duration / 10} />
                <Result
                  label="GENERATIONS"
                  value={`≈ ${(duration / 25).toFixed(1)}`}
                  unit="25 years each"
                />
                <Result
                  label="CENTURIES COVERED"
                  value={centuriesCovered(startValue, endValue)}
                />
                <Text style={s.body}>Calculated without a year zero.</Text>
              </>
            ) : (
              <Text style={s.body}>
                {start && end
                  ? 'Enter positive whole years in chronological order.'
                  : 'Enter both years to calculate.'}
              </Text>
            )}
          </>
        ) : tab === 'Time Distance' ? (
          <>
            <Field
              label="Event A"
              value={aName}
              onChange={setAName}
              placeholder="Event name (optional)"
            />
            <Field
              label="Year A (negative = BCE)"
              value={a}
              onChange={setA}
              numeric
            />
            <Field
              label="Event B"
              value={bName}
              onChange={setBName}
              placeholder="Event name (optional)"
            />
            <Field
              label="Year B (negative = BCE)"
              value={b}
              onChange={setB}
              numeric
            />
            {gapValid ? (
              <>
                <Result label="YEARS BETWEEN" value={gap} />
                <Result label="DECADES" value={gap / 10} />
                <Result label="CENTURIES" value={gap / 100} />
                <Text style={s.body}>
                  {Number(a) === Number(b)
                    ? 'Both events are in the same year.'
                    : `${
                        Number(a) < Number(b)
                          ? aName || 'Event A'
                          : bName || 'Event B'
                      } happened first.`}
                </Text>
              </>
            ) : (
              <Text style={s.body}>
                Enter two valid years. There is no year zero.
              </Text>
            )}
          </>
        ) : (
          <>
            <Field label="Starting city" value={from} onChange={setFrom} />
            <Field label="Destination" value={to} onChange={setTo} />
            <Text style={s.chipText}>
              Available cities: {Object.keys(cities).join(', ')}. For another
              route, enter its distance below.
            </Text>
            <Field
              label="Route distance in km (optional)"
              value={km}
              onChange={setKm}
              numeric
              placeholder="Estimate from cities"
            />
            <Text style={s.label}>HISTORICAL ERA</Text>
            <Chips
              options={['Ancient', 'Medieval', 'Early Modern']}
              value={era}
              onChange={setEra}
            />
            <Text style={s.label}>TRAVEL METHOD</Text>
            <Chips
              options={['Foot', 'Horse', 'Caravan', 'Ship']}
              value={method}
              onChange={setMethod}
            />
            {journeyValid ? (
              <>
                <Result
                  label="ESTIMATED TRAVEL TIME"
                  value={`${Math.ceil(routeKm / speed)} days`}
                  unit={`${from} → ${to}`}
                />
                <Result
                  label="DISTANCE"
                  value={Math.round(routeKm).toLocaleString()}
                  unit="km"
                />
                <Result
                  label="SPEED"
                  value={Math.round(speed)}
                  unit="km / day"
                />
                <Text style={s.body}>
                  Difficulty:{' '}
                  {routeKm > 2500 ? 'Hard' : routeKm > 800 ? 'Moderate' : 'Low'}
                </Text>
                <Text style={s.chipText}>
                  Planning estimate using assumed daily speeds.{' '}
                  {km
                    ? 'Uses your route distance.'
                    : 'Distance uses a straight-line calculation × 1.35, not a verified historical route.'}{' '}
                  Weather, terrain, rest stops and access to navigable waterways
                  are not modeled.
                </Text>
              </>
            ) : (
              <Text style={s.body}>
                Choose two different supported cities or enter a positive route
                distance.
              </Text>
            )}
          </>
        )}
      </Card>
    </Screen>
  );
}
