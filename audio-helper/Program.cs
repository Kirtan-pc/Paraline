using System.Runtime.InteropServices;
using System.Text.Json;

namespace Paraline.AudioBridge;

internal static class Program
{
    [STAThread]
    private static void Main()
    {
        try
        {
            using var capture = new WasapiLoopbackCapture();

            Console.Error.WriteLine("WASAPI loopback capture started.");

            while (true)
            {
                var value = capture.ReadLevel();

                // Keep the stdout contract stable so Electron does not need to change.
                var payload = JsonSerializer.Serialize(new
                {
                    type = "level",
                    value
                });

                Console.WriteLine(payload);
                Thread.Sleep(33);
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine("Loopback capture failed to start.");
            Console.Error.WriteLine(ex.Message);
            Environment.Exit(1);
        }
    }
}

internal sealed class WasapiLoopbackCapture : IDisposable
{
    private static readonly Guid ClsidMmDeviceEnumerator = new("BCDE0395-E52F-467C-8E3D-C4579291692E");
    private static readonly Guid IidIAudioClient = new("1CB9AD4C-DBFA-4c32-B178-C2F568A703B2");
    private static readonly Guid IidIAudioCaptureClient = new("C8ADBD64-E71E-48a0-A4DE-185C395CD317");
    private static readonly Guid KsdDataFormatSubtypePcm = new("00000001-0000-0010-8000-00AA00389B71");
    private static readonly Guid KsdDataFormatSubtypeIeeeFloat = new("00000003-0000-0010-8000-00AA00389B71");

    private readonly IMMDeviceEnumerator _deviceEnumerator;
    private readonly IMMDevice _device;
    private readonly IAudioClient _audioClient;
    private readonly IAudioCaptureClient _captureClient;
    private readonly IntPtr _mixFormatPointer;
    private readonly WaveFormatEx _mixFormat;
    private readonly SampleFormat _sampleFormat;
    private readonly int _bytesPerSample;
    private readonly int _channelCount;
    private byte[] _sampleBuffer = Array.Empty<byte>();
    private bool _isStarted;
    private double _lastLevel;

    public WasapiLoopbackCapture()
    {
        // MMDevice gives us the current default speaker/device on Windows.
        var enumeratorType = Type.GetTypeFromCLSID(ClsidMmDeviceEnumerator)
            ?? throw new InvalidOperationException("Could not create the Windows audio device enumerator.");

        _deviceEnumerator = (IMMDeviceEnumerator)Activator.CreateInstance(enumeratorType)!;

        Marshal.ThrowExceptionForHR(
            _deviceEnumerator.GetDefaultAudioEndpoint(EDataFlow.eRender, ERole.eMultimedia, out _device));

        var audioClientGuid = IidIAudioClient;
        Marshal.ThrowExceptionForHR(
            _device.Activate(ref audioClientGuid, ClsCtx.CLSCTX_ALL, IntPtr.Zero, out var audioClientObject));

        _audioClient = (IAudioClient)audioClientObject;

        // The shared-mode mix format is the simplest format to use for loopback capture.
        Marshal.ThrowExceptionForHR(_audioClient.GetMixFormat(out _mixFormatPointer));
        _mixFormat = Marshal.PtrToStructure<WaveFormatEx>(_mixFormatPointer);

        (_sampleFormat, _bytesPerSample) = DetectSampleFormat(_mixFormatPointer, _mixFormat);
        _channelCount = _mixFormat.nChannels;

        Marshal.ThrowExceptionForHR(
            _audioClient.Initialize(
                AudioClientShareMode.Shared,
                AudioClientStreamFlags.Loopback,
                0,
                0,
                _mixFormatPointer,
                IntPtr.Zero));

        var captureClientGuid = IidIAudioCaptureClient;
        Marshal.ThrowExceptionForHR(
            _audioClient.GetService(ref captureClientGuid, out var captureClientObject));

        _captureClient = (IAudioCaptureClient)captureClientObject;

        Marshal.ThrowExceptionForHR(_audioClient.Start());
        _isStarted = true;
    }

    public double ReadLevel()
    {
        double sumSquares = 0;
        var sampleCount = 0;

        while (true)
        {
            Marshal.ThrowExceptionForHR(_captureClient.GetNextPacketSize(out var nextPacketFrames));

            if (nextPacketFrames == 0)
            {
                break;
            }

            IntPtr dataPointer = IntPtr.Zero;
            uint framesRead = 0;

            Marshal.ThrowExceptionForHR(
                _captureClient.GetBuffer(
                    out dataPointer,
                    out framesRead,
                    out var flags,
                    out _,
                    out _));

            try
            {
                var packetSampleCount = checked((int)framesRead * _channelCount);

                if ((flags & AudioClientBufferFlags.Silent) != 0)
                {
                    sampleCount += packetSampleCount;
                    continue;
                }

                AccumulateSamples(dataPointer, packetSampleCount, ref sumSquares, ref sampleCount);
            }
            finally
            {
                Marshal.ThrowExceptionForHR(_captureClient.ReleaseBuffer(framesRead));
            }
        }

        if (sampleCount > 0)
        {
            // RMS gives us a smooth loudness-style value for the visualizer.
            _lastLevel = Math.Sqrt(sumSquares / sampleCount);
        }
        else
        {
            // When no packet arrives, decay gently instead of snapping to zero.
            _lastLevel *= 0.92;
        }

        return Math.Clamp(_lastLevel, 0, 1);
    }


            var payload = JsonSerializer.Serialize(new
            {
                type = "level",
                value
            });

            Console.WriteLine(payload);
            await Task.Delay(33);
        }
    }
}
