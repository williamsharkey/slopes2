<?php
// ============================================================================
// SLOPES 2 — REAL-TIME SHARED WORLD & DRIFT-MESH/1.0 RELAY (drift_mesh.php)
// Connects real players across browsers/devices into one shared world where
// players appear as mostly-white Monoliths with distinct highlight hues,
// chat live, and co-edit the same terrain even from drifted code forks.
// ============================================================================
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$stateFile = sys_get_temp_dir() . '/slopes2_shared_world_v1.json';
$now = time();
$ttlSeconds = 45; // Active player Monoliths stay visible for 45s after last heartbeat

$fp = @fopen($stateFile, 'c+');
if (!$fp) {
    echo json_encode(array('ok' => false, 'peers' => array(), 'edits' => array()));
    exit;
}

flock($fp, LOCK_EX);
$raw = stream_get_contents($fp);
$data = $raw ? @json_decode($raw, true) : null;
if (!is_array($data)) {
    $data = array('peers' => array(), 'edits' => array(), 'lamportClock' => 1);
}
if (!isset($data['peers']) || !is_array($data['peers'])) $data['peers'] = array();
if (!isset($data['edits']) || !is_array($data['edits'])) $data['edits'] = array();
if (!isset($data['lamportClock'])) $data['lamportClock'] = 1;

// Prune stale peers (> 45s old)
foreach ($data['peers'] as $pid => $peer) {
    if (!isset($peer['updatedAt']) || ($now - intval($peer['updatedAt'])) > $ttlSeconds) {
        unset($data['peers'][$pid]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');
    $in = $body ? @json_decode($body, true) : null;
    if (is_array($in) && !empty($in['peerId'])) {
        $pid = preg_replace('/[^A-Za-z0-9_\-]/', '', substr(strval($in['peerId']), 0, 32));
        if ($pid !== '') {
            $existing = isset($data['peers'][$pid]) ? $data['peers'][$pid] : array();
            $chatBubble = isset($in['chatBubble']) ? substr(trim(strval($in['chatBubble'])), 0, 120) : (isset($existing['chatBubble']) ? $existing['chatBubble'] : '');
            $chatUpdatedAt = isset($existing['chatUpdatedAt']) ? intval($existing['chatUpdatedAt']) : 0;
            if (!empty($in['newChat'])) {
                $chatUpdatedAt = $now;
            } elseif (($now - $chatUpdatedAt) > 25) {
                $chatBubble = '';
            }

            $data['peers'][$pid] = array(
                'id'           => $pid,
                'handle'       => isset($in['handle']) ? substr(trim(strval($in['handle'])), 0, 28) : 'wanderer',
                'driftBranch'  => isset($in['driftBranch']) ? substr(trim(strval($in['driftBranch'])), 0, 32) : 'main',
                'codeHash'     => isset($in['codeHash']) ? substr(trim(strval($in['codeHash'])), 0, 24) : 'sha256:live',
                'highlightHue' => isset($in['highlightHue']) ? intval($in['highlightHue']) % 360 : 192,
                'highlightHex' => isset($in['highlightHex']) ? substr(trim(strval($in['highlightHex'])), 0, 16) : '#38d9f5',
                'highlightRgb' => (isset($in['highlightRgb']) && is_array($in['highlightRgb']) && count($in['highlightRgb']) === 3)
                    ? array(intval($in['highlightRgb'][0]), intval($in['highlightRgb'][1]), intval($in['highlightRgb'][2]))
                    : array(56, 217, 245),
                'roomX'        => isset($in['roomX']) ? intval($in['roomX']) : 0,
                'roomY'        => isset($in['roomY']) ? intval($in['roomY']) : 0,
                'x'            => isset($in['x']) ? floatval($in['x']) : 56,
                'y'            => isset($in['y']) ? floatval($in['y']) : 18,
                'chatBubble'   => $chatBubble,
                'chatUpdatedAt'=> $chatUpdatedAt,
                'lastEditOp'   => isset($in['lastEditOp']) ? substr(strval($in['lastEditOp']), 0, 40) : '',
                'updatedAt'    => $now,
                'isRealPlayer' => true,
            );

            if (isset($in['editEnvelope']) && is_array($in['editEnvelope'])) {
                $data['lamportClock'] = intval($data['lamportClock']) + 1;
                $env = $in['editEnvelope'];
                $env['lamportTs'] = $data['lamportClock'];
                $env['peerId'] = $pid;
                $env['ts'] = $now;
                $data['edits'][] = $env;
                if (count($data['edits']) > 40) {
                    $data['edits'] = array_slice($data['edits'], -40);
                }
            }
        }
    }

    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($data));
    fflush($fp);
}

flock($fp, LOCK_UN);
fclose($fp);

$peerList = array_values($data['peers']);
echo json_encode(array(
    'ok'           => true,
    'serverTime'   => $now,
    'lamportClock' => $data['lamportClock'],
    'peers'        => $peerList,
    'edits'        => $data['edits'],
));
