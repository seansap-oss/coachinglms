import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const meetingNumber = String(body.meetingNumber || '').replace(/\s/g,'');
    const role = Number(body.role ?? 0);
    if(!meetingNumber) return NextResponse.json({ error:'meetingNumber required' }, { status:400 });
    const sdkKey = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY || process.env.ZOOM_SDK_KEY || '';
    const sdkSecret = process.env.ZOOM_SDK_SECRET || process.env.NEXT_PUBLIC_ZOOM_SDK_SECRET || '';
    if(!sdkKey || !sdkSecret){
      return NextResponse.json({ signature: 'mock_signature_' + Date.now(), sdkKey: 'mock_sdk_key', meetingNumber, role, mock: true, message: 'Add NEXT_PUBLIC_ZOOM_SDK_KEY + ZOOM_SDK_SECRET to env for real Zoom JWT' });
    }
    const iat = Math.round(Date.now()/1000) - 30;
    const exp = iat + 60*60*2;
    const header = { alg:'HS256', typ:'JWT' };
    const payload = { sdkKey, mn: meetingNumber, role, iat, exp, appKey: sdkKey, tokenExp: exp };
    const b64 = (obj:any)=> Buffer.from(JSON.stringify(obj)).toString('base64url');
    const headerB64 = b64(header);
    const payloadB64 = b64(payload);
    const signature = crypto.createHmac('sha256', sdkSecret).update(`${headerB64}.${payloadB64}`).digest('base64url');
    const jwt = `${headerB64}.${payloadB64}.${signature}`;
    return NextResponse.json({ signature: jwt, sdkKey, meetingNumber, role });
  }catch(e:any){ return NextResponse.json({ error: e?.message || 'failed' }, { status:500 }); }
}
export async function GET(){ return NextResponse.json({ ok:true, usage:'POST { meetingNumber, role } -> { signature, sdkKey }', docs:'https://developers.zoom.us/docs/meeting-sdk/auth/' }); }
